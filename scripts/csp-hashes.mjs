// Post-build: compute SHA-256 hashes of every inline <script> in the built
// site and inject them into the Content-Security-Policy script-src, so we can
// drop 'unsafe-inline' without breaking the theme/FOUC and hoisted scripts.
//
// Runs after `astro build` (see package.json). Operates on dist/, which is what
// Azure Static Web Apps deploys.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const DIST = 'dist';
const CONFIG = join(DIST, 'staticwebapp.config.json');

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else if (p.endsWith('.html')) out.push(p);
  }
  return out;
}

// Collect the exact body text of every inline, executable <script>.
const scriptRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
const hashes = new Set();

for (const file of walk(DIST)) {
  const html = readFileSync(file, 'utf8');
  let m;
  while ((m = scriptRe.exec(html)) !== null) {
    const attrs = m[1];
    const body = m[2];
    if (/\ssrc=/.test(attrs)) continue; // external, covered by 'self'
    if (/application\/(ld\+json|json)/i.test(attrs)) continue; // data, not executed
    if (body.trim() === '') continue;
    const digest = createHash('sha256').update(body, 'utf8').digest('base64');
    hashes.add(`'sha256-${digest}'`);
  }
}

const config = JSON.parse(readFileSync(CONFIG, 'utf8'));
const csp = config.globalHeaders['Content-Security-Policy'];
const sorted = [...hashes].sort();

const newCsp = csp
  .split(';')
  .map((directive) => {
    const d = directive.trim();
    if (!d.startsWith('script-src')) return directive;
    // Rebuild script-src: keep 'self' and any explicit host allowlist (e.g.
    // hCaptcha), drop 'unsafe-inline', add the inline-script hashes.
    const hosts = d
      .split(/\s+/)
      .slice(1)
      .filter((t) => t.startsWith('https://') || t.startsWith('http://'));
    return ` script-src 'self' ${[...hosts, ...sorted].join(' ')}`;
  })
  .join(';');

config.globalHeaders['Content-Security-Policy'] = newCsp;
writeFileSync(CONFIG, JSON.stringify(config, null, 2) + '\n');

console.log(
  `csp-hashes: injected ${sorted.length} script hashes, removed 'unsafe-inline' from script-src`
);
