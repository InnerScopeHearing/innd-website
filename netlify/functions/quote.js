/* ==========================================================================
   /.netlify/functions/quote
   Returns a normalized INND quote object for the Tier 3 custom widget.
   Source selection via QUOTE_PROVIDER env var: "polygon" (default) | "finnhub".
   ========================================================================== */

const SYMBOL = 'INND';
const CACHE_SECONDS = 10;

exports.handler = async () => {
  const provider = (process.env.QUOTE_PROVIDER || 'polygon').toLowerCase();

  try {
    let quote;
    if (provider === 'finnhub') {
      quote = await fetchFinnhub();
    } else {
      quote = await fetchPolygon();
    }
    return ok(quote);
  } catch (err) {
    return error(err);
  }
};

// ---------------------------------------------------------------------------
// Polygon.io adapter (recommended primary for sub-penny OTC).
// Endpoint docs: https://polygon.io/docs/stocks/get_v2_aggs_ticker
// ---------------------------------------------------------------------------
async function fetchPolygon() {
  const key = process.env.POLYGON_API_KEY;
  if (!key) throw new Error('POLYGON_API_KEY not configured');

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
    source: 'polygon'
  };
}

// ---------------------------------------------------------------------------
// Finnhub adapter (free tier — staging only, OTC sub-penny coverage unreliable).
// Endpoint docs: https://finnhub.io/docs/api/quote
// ---------------------------------------------------------------------------
async function fetchFinnhub() {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) throw new Error('FINNHUB_API_KEY not configured');

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
    source: 'finnhub'
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

function error(err) {
  return {
    statusCode: 502,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'access-control-allow-origin': '*'
    },
    body: JSON.stringify({ error: String(err && err.message || err) })
  };
}
