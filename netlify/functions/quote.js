/* ==========================================================================
   /.netlify/functions/quote
   Returns a normalized INND quote for the custom hero ticker.

   Source priority:
     1. TradingView scanner (OTC:INND) — same feed their widgets use,
        sub-penny precision, includes market cap and shares outstanding
     2. Yahoo Finance (chart endpoint) — fallback, ~15 min delayed
     3. Mock data — final fallback so the front-end never breaks

   Override via QUOTE_PROVIDER env var: "tradingview"|"yahoo"|"mock"
   ========================================================================== */

const SYMBOL = 'INND';
const TV_SYMBOL = 'OTC:INND';
const CACHE_SECONDS = 30;

// ---------------------------------------------------------------------------
// Operator-supplied authoritative share count.
// TradingView's total_shares_outstanding for OTC:INND is stale (returns
// 183,080,000 as of 2026-05-04), so we ignore that field and compute market
// cap from this number instead. Update this constant when the issuer's
// outstanding share count changes (e.g. after a reverse split, share buyback,
// or new issuance) and re-deploy.
//
// Source: company books, confirmed by Matt Moore (CEO) on 2026-06-03.
// ---------------------------------------------------------------------------
const SHARES_OUTSTANDING = 889_823_171;
const BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

exports.handler = async () => {
  const provider = (process.env.QUOTE_PROVIDER || 'tradingview').toLowerCase();
  if (provider === 'mock') return ok(buildMock('explicit-mock'));

  // Primary: TradingView (unless explicitly forced to Yahoo)
  if (provider === 'tradingview' || provider === 'auto') {
    try {
      return ok(await fetchTradingView());
    } catch (err) {
      console.error('TradingView fetch failed:', err.message);
      // Fall through to Yahoo
    }
  }

  // Yahoo (explicit or fallback)
  try {
    return ok(await fetchYahoo());
  } catch (err) {
    return ok(buildMock(`all-providers-failed: ${err.message}`));
  }
};

// ---------------------------------------------------------------------------
// TradingView scanner (unofficial; same data feed their public widgets use)
// ---------------------------------------------------------------------------
async function fetchTradingView() {
  const fields = [
    'name', 'description', 'exchange',
    'close', 'change', 'change_abs',
    'open', 'high', 'low', 'volume', 'VWAP',
    'price_52_week_high', 'price_52_week_low',
    'market_cap_basic', 'total_shares_outstanding',
    'update_mode', 'timezone'
  ].join(',');
  const url = `https://scanner.tradingview.com/symbol?symbol=${encodeURIComponent(TV_SYMBOL)}&fields=${fields}`;
  const r = await fetch(url, {
    headers: {
      'User-Agent': BROWSER_UA,
      'Accept': 'application/json',
      'Origin': 'https://www.tradingview.com',
      'Referer': 'https://www.tradingview.com/'
    }
  });
  if (!r.ok) throw new Error(`TradingView ${r.status}`);
  const d = await r.json();

  const price = Number(d.close);
  const changeAbs = Number(d.change_abs ?? 0);
  const changePct = Number(d.change ?? 0);
  // delayed_streaming_900 = 900-second (15-min) delay; realtime = 0
  const delayedMinutes = String(d.update_mode || '').includes('realtime') ? 0 : 15;

  return {
    symbol: SYMBOL,
    name: d.description || 'InnerScope Hearing Technologies, Inc.',
    exchange: d.exchange || 'OTC Markets',
    price: roundSubPenny(price),
    change: roundSubPenny(changeAbs),
    changePct: Number(changePct.toFixed(2)),
    open: roundSubPenny(Number(d.open ?? price)),
    dayHigh: roundSubPenny(Number(d.high ?? price)),
    dayLow: roundSubPenny(Number(d.low ?? price)),
    yearHigh: roundSubPenny(Number(d.price_52_week_high ?? price)),
    yearLow: roundSubPenny(Number(d.price_52_week_low ?? price)),
    volume: Number(d.volume ?? 0),
    vwap: roundSubPenny(Number(d.VWAP ?? price)),
    // Operator-supplied share count overrides stale TradingView figure (183M vs 889M)
    marketCap: roundSubPenny(price) * SHARES_OUTSTANDING,
    sharesOutstanding: SHARES_OUTSTANDING,
    ts: new Date().toISOString(),
    source: 'tradingview',
    delayedMinutes,
    mock: false
  };
}

// ---------------------------------------------------------------------------
// Yahoo Finance v8 chart endpoint (fallback)
// ---------------------------------------------------------------------------
async function fetchYahoo() {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${SYMBOL}?interval=1d&range=5d`;
  const r = await fetch(url, { headers: { 'User-Agent': BROWSER_UA } });
  if (!r.ok) throw new Error(`Yahoo ${r.status}`);
  const data = await r.json();
  const result = data?.chart?.result?.[0];
  if (!result) throw new Error('Yahoo: empty result');
  const meta = result.meta || {};
  const price = Number(meta.regularMarketPrice);
  const prevClose = Number(meta.chartPreviousClose);
  const change = price - prevClose;
  const changePct = prevClose ? (change / prevClose) * 100 : 0;
  return {
    symbol: SYMBOL,
    name: meta.longName || 'InnerScope Hearing Technologies, Inc.',
    exchange: meta.fullExchangeName || 'OTC Markets',
    price: roundSubPenny(price),
    change: roundSubPenny(change),
    changePct: Number(changePct.toFixed(2)),
    open: roundSubPenny(prevClose),
    dayHigh: roundSubPenny(Number(meta.regularMarketDayHigh ?? price)),
    dayLow: roundSubPenny(Number(meta.regularMarketDayLow ?? price)),
    yearHigh: roundSubPenny(Number(meta.fiftyTwoWeekHigh ?? price)),
    yearLow: roundSubPenny(Number(meta.fiftyTwoWeekLow ?? price)),
    volume: Number(meta.regularMarketVolume ?? 0),
    vwap: 0,
    marketCap: roundSubPenny(price) * SHARES_OUTSTANDING,
    sharesOutstanding: SHARES_OUTSTANDING,
    ts: new Date((meta.regularMarketTime || Math.floor(Date.now()/1000)) * 1000).toISOString(),
    source: 'yahoo',
    delayedMinutes: 15,
    mock: false
  };
}

// ---------------------------------------------------------------------------
// Mock generator (time-bucketed, ~$0.0004 hovering)
// ---------------------------------------------------------------------------
function buildMock(reason) {
  const base = 0.0004;
  const minuteBucket = Math.floor(Date.now() / 60_000);
  const seed = (minuteBucket * 9301 + 49297) % 233280;
  const noise = (seed / 233280 - 0.5) * 0.0001;
  const price = roundSubPenny(base + noise);
  const prevClose = base;
  const change = roundSubPenny(price - prevClose);
  const changePct = prevClose ? Number(((change / prevClose) * 100).toFixed(2)) : 0;
  return {
    symbol: SYMBOL,
    name: 'InnerScope Hearing Technologies, Inc.',
    exchange: 'OTC Markets (mock)',
    price, change, changePct,
    open: prevClose,
    dayHigh: roundSubPenny(price + 0.0001),
    dayLow:  roundSubPenny(price - 0.0001),
    yearHigh: 0.009,
    yearLow:  0.0003,
    volume: 25_000_000 + (seed % 30_000_000),
    vwap: price,
    marketCap: roundSubPenny(price) * SHARES_OUTSTANDING,
    sharesOutstanding: SHARES_OUTSTANDING,
    ts: new Date().toISOString(),
    source: 'mock',
    delayedMinutes: 0,
    mock: true,
    mock_reason: reason
  };
}

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------
// Round to 6 decimals for sub-penny stocks but trim trailing zeros to 4 for display
function roundSubPenny(n) {
  if (typeof n !== 'number' || !isFinite(n)) return 0;
  return Math.round(n * 1_000_000) / 1_000_000;
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
