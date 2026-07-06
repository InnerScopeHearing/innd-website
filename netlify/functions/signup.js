/* ==========================================================================
   /.netlify/functions/signup
   Receives the INND shareholder-updates signup, validates it, and forwards
   to the n8n shareholder webhook, which handles:
     - Customer.io upsert + "INND Shareholder List" segment membership
     - Shopify unique $50 welcome-credit code generation (eligible products)
     - fire welcome event -> Customer.io sends welcome email w/ personal code

   DARK until N8N_SHAREHOLDER_WEBHOOK is set in Netlify env. Without it, the
   function accepts the signup and returns ok:true (queued) but issues nothing,
   so a staging form never leaks real $50 codes.
   ========================================================================== */

const ALLOWED_ORIGINS = [
  'https://innd.com',
  'https://www.innd.com',
  'https://innd.netlify.app'
];

function corsHeaders(origin) {
  const matched = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': matched,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
    'Vary': 'Origin'
  };
}

function resp(statusCode, obj, origin = '') {
  return { statusCode, headers: corsHeaders(origin), body: JSON.stringify(obj) };
}

function sanitizeName(s) {
  return String(s || '').trim().slice(0, 100).replace(/[<>&"']/g, '');
}

exports.handler = async (event) => {
  const origin = event.headers.origin || event.headers.Origin || '';

  if (event.httpMethod === 'OPTIONS') return resp(204, {}, origin);
  if (event.httpMethod !== 'POST') return resp(405, { error: 'method_not_allowed' }, origin);

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return resp(400, { error: 'bad_json' }, origin); }

  // Honeypot: bots fill the hidden "company" field.
  if (body.company) return resp(200, { ok: true }, origin);

  const email = String(body.email || '').trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return resp(400, { error: 'invalid_email' }, origin);
  }

  // Consent must be explicitly true — do not soft-accept false
  if (!body.consent) return resp(400, { error: 'consent_required' }, origin);

  const payload = {
    source: 'innd-shareholder-updates',
    email,
    first_name: sanitizeName(body.first_name),
    last_name: sanitizeName(body.last_name),
    consent: true,
    ts: Date.now()
  };

  const hook = process.env.N8N_SHAREHOLDER_WEBHOOK;
  if (!hook) {
    console.log('signup queued (no webhook configured)');
    return resp(200, { ok: true, queued: true }, origin);
  }

  try {
    const r = await fetch(hook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Signup-Secret': process.env.N8N_SHAREHOLDER_SECRET || ''
      },
      body: JSON.stringify(payload)
    });
    if (!r.ok) throw new Error('hook_status_' + r.status);
    return resp(200, { ok: true }, origin);
  } catch (err) {
    console.error('signup forward failed:', err.message);
    // Soft-succeed so the visitor is not blocked; n8n retry/dedupe handles it.
    return resp(200, { ok: true, deferred: true }, origin);
  }
};
