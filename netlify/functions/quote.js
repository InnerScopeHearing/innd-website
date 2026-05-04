/* ==========================================================================
   /.netlify/functions/quote
   Returns a normalized INND quote object for the Tier 3 custom widget.

   Source selection via QUOTE_PROVIDER env var:
     "polygon" (default) | "finnhub" | "mock"

   When the configured provider's API key is missing, automatically falls
   back to deterministic mock data with mock:true flag set in the response.
   This lets Tier 3 staging work end-to-end without a paid Polygon plan.
   ========================================================================== */

const SYMBOL = 'INND';
const CACHE_SECONDS = 10;

exports.handler = async () => {
  const provider = (process.env.QUOTE_PROVIDER || 'polygon').toLowerCase();

  // Explicit mock mode
  if (provider === 'mock') {
    return ok(buildMock('explicit-mock'));
  }

  try {
    let quote;
    if (provider === 'finnhub') {
      if (!process.env.FINNHUB_API_KEY) return ok(buildMock('finnhub-no-key'));
      quote = await fetchFinnhub();
    } else {
      if (!process.env.POLYGON_API_KEY) return ok(buildMock('polygon-no-key'));
      quote = await fetchPolygon();
    }
    return ok(quote);
  } catch (err) {
    // On upstream API failure, return mock with the error noted
    return ok(buildMock(`error: ${String(err && err.message || err)}`));
  }
};

// ---------------------------------------------------------------------------
// Polygon.io adapter (recommended primary for sub-penny OTC).
// ---------------------------------------------------------------------------
async function fetchPolygon() {
  const key = process.env.POLYGON_API_KEY;
  const url = `https://api.polygon.io/v2/aggs/ticker/${SYMBOL}/prev?adjusted=true&apiKey=${encodeURIComponent(key)}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Polygon ${r.status}`);
  const data = await r.json();
  const bar = data?.results?.[0];
  if (!bar) throw new Error('Polygon: empty result');

  const price = Number(bar.c);
  const open = Number(bar.o);
  const change = price - open;
  const changePct = open ? (change / open) * 100 : 0;

  return {
    symbol: SYMBOL,
    price: round4(price),
    change: round4(change),
    changePct: Number(changePct.toFixed(2)),
    volume: Number(bar.v ?? 0),
    ts: new Date(bar.t || Date.now()).toISOString(),
    source: 'polygon',
    mock: false
  };
}

// ---------------------------------------------------------------------------
// Finnhub adapter (free tier — staging only, OTC sub-penny coverage unreliable).
// ---------------------------------------------------------------------------
async function fetchFinnhub() {
  const key = process.env.FINNHUB_API_KEY;
  const url = `https://finnhub.io/api/v1/quote?symbol=${SYMBOL}&token=${encodeURIComponent(key)}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Finnhub ${r.status}`);
  const q = await r.json();

  const price = Number(q.c);
  const change = Number(q.d ?? 0);
  const changePct = Number(q.dp ?? 0);

  return {
    symbol: SYMBOL,
    price: round4(price),
    change: round4(change),
    changePct: Number(changePct.toFixed(2)),
    volume: 0,
    ts: new Date((q.t || Math.floor(Date.now() / 1000)) * 1000).toISOString(),
    source: 'finnhub',
    mock: false
  };
}

// ---------------------------------------------------------------------------
// Mock data generator. Deterministic-ish so each request shows realistic
// micro-fluctuations without being wildly different across reloads.
// Sub-penny INND-style: price hovers around $0.0040 with tiny daily moves.
// ---------------------------------------------------------------------------
function buildMock(reason) {
  const base = 0.0040;
  // Use a slow time-bucketed random walk so reloads within a minute show
  // similar prices (no whiplash on staging).
  const minuteBucket = Math.floor(Date.now() / 60_000);
  const seed = (minuteBucket * 9301 + 49297) % 233280;
  const noise = (seed / 233280 - 0.5) * 0.0008;  // +/- 0.0004
  const price = round4(base + noise);
  const open = round4(base);
  const change = round4(price - open);
  const changePct = open ? Number(((change / open) * 100).toFixed(2)) : 0;

  return {
    symbol: SYMBOL,
    price,
    change,
    changePct,
    volume: 125_000 + (seed % 50_000),
    ts: new Date().toISOString(),
    source: 'mock',
    mock: true,
    mock_reason: reason
  };
}

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

function round4(n) {
  if (typeof n !== 'number' || !isFinite(n)) return 0;
  return Math.round(n * 10000) / 10000;
}

function ok(body) {
  return {
    statusCode: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': `public, max-age=${CACHE_SECONDS}`,
      'access-control-allow-origin': '*'
    },
    body: JSON.stringify(body)
  };
}
