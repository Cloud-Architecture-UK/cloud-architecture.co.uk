// Same-origin proxy: teal footer form -> Kit / ConvertKit.
// Secret lives in the KIT_API_KEY app setting (never in repo/client).
// Tries Kit v4 (API-key header, then Bearer); if KIT_FORM_ID is set, also
// the legacy ConvertKit v3 form-subscribe endpoint.
//
// Abuse protection (the endpoint is anonymous by design, so it self-defends):
//   1. Honeypot   - a hidden form field no human fills; if set, we no-op and
//                   report success so the bot learns nothing.
//   2. Rate limit - best-effort per-IP sliding window. SWA reuses a function
//                   instance across invocations for a while, so a module-scope
//                   map throttles a single noisy source; it is not a hard,
//                   cross-instance guarantee.
//   3. hCaptcha   - verified only when HCAPTCHA_SECRET is configured, so the
//                   form keeps working until the widget + secret are wired.
//                   The site CSP already trusts hCaptcha for this.
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 5;
const hits = new Map(); // ip -> number[] (timestamps, best-effort)

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_MAX;
}

async function hcaptchaOk(token, remoteip) {
  const secret = process.env.HCAPTCHA_SECRET;
  if (!secret) return true; // not configured -> skip (progressive hardening)
  if (!token) return false;
  try {
    const params = new URLSearchParams({ secret, response: token });
    if (remoteip) params.set('remoteip', remoteip);
    const r = await fetch('https://api.hcaptcha.com/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });
    const j = await r.json().catch(() => ({}));
    return j.success === true;
  } catch {
    return false; // fail closed once captcha is switched on
  }
}

module.exports = async function (context, req) {
  const body = req.body || {};
  const email = (body.email || '').toString().trim();
  const honeypot = (body.website || '').toString().trim(); // hidden field
  const captchaToken = (body.captchaToken || '').toString().trim();
  const apiKey = process.env.KIT_API_KEY;
  const formId = process.env.KIT_FORM_ID;
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';

  const json = (status, resBody) => {
    context.res = { status, headers: { 'Content-Type': 'application/json' }, body: resBody };
  };

  // Bot filled the honeypot: pretend success, do nothing.
  if (honeypot) return json(200, { success: true });

  if (rateLimited(ip)) return json(429, { success: false, error: 'Too many requests' });

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    return json(400, { success: false, error: 'Invalid email' });

  if (!(await hcaptchaOk(captchaToken, ip)))
    return json(400, { success: false, error: 'Captcha failed' });

  if (!apiKey) return json(500, { success: false, error: 'Not configured' });

  const attempts = [
    { name: 'v4-header', url: 'https://api.kit.com/v4/subscribers', headers: { 'X-Kit-Api-Key': apiKey }, body: { email_address: email } },
    { name: 'v4-bearer', url: 'https://api.kit.com/v4/subscribers', headers: { Authorization: `Bearer ${apiKey}` }, body: { email_address: email } },
  ];
  if (formId) {
    attempts.push({ name: 'v3-form', url: `https://api.convertkit.com/v3/forms/${formId}/subscribe`, headers: {}, body: { api_key: apiKey, email } });
  }

  for (const a of attempts) {
    try {
      const r = await fetch(a.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...a.headers },
        body: JSON.stringify(a.body),
      });
      if (r.ok) return json(200, { success: true });
    } catch (e) {
      context.log.error('subscribe attempt failed', a.name, e);
    }
  }
  return json(502, { success: false, error: 'Subscription failed' });
};
