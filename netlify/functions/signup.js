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

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

function resp(statusCode, obj) {
  return { statusCode, headers: CORS, body: JSON.stringify(obj) };
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return resp(204, {});
  if (event.httpMethod !== 'POST') return resp(405, { error: 'method_not_allowed' });

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return resp(400, { error: 'bad_json' }); }

  // Honeypot: bots fill the hidden "company" field.
  if (body.company) return resp(200, { ok: true });

  const email = String(body.email || '').trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return resp(400, { error: 'invalid_email' });

  const payload = {
    source: 'innd-shareholder-updates',
    email,
    first_name: String(body.first_name || '').trim(),
    last_name: String(body.last_name || '').trim(),
    consent: !!body.consent,
    ts: Date.now()
  };

  const hook = process.env.N8N_SHAREHOLDER_WEBHOOK;
  if (!hook) {
    console.log('signup queued (no webhook configured):', email);
    return resp(200, { ok: true, queued: true });
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
    return resp(200, { ok: true });
  } catch (err) {
    console.error('signup forward failed:', err.message);
    // Soft-succeed so the visitor is not blocked; n8n retry/dedupe handles it.
    return resp(200, { ok: true, deferred: true });
  }
};
