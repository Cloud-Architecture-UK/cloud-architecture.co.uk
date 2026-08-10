// Same-origin proxy: teal footer form -> Kit / ConvertKit.
// Secret lives in the KIT_API_KEY app setting (never in repo/client).
// Tries Kit v4 (API-key header, then Bearer); if KIT_FORM_ID is set, also
// the legacy ConvertKit v3 form-subscribe endpoint.
module.exports = async function (context, req) {
  const email = ((req.body && req.body.email) || '').toString().trim();
  const apiKey = process.env.KIT_API_KEY;
  const formId = process.env.KIT_FORM_ID;

  const json = (status, body) => {
    context.res = { status, headers: { 'Content-Type': 'application/json' }, body };
  };

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    return json(400, { success: false, error: 'Invalid email' });
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
