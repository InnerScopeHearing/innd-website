/* ==========================================================================
   /.netlify/functions/health
   Returns build SHA + provider status for ops verification.
   ========================================================================== */

exports.handler = async () => {
  const provider = (process.env.QUOTE_PROVIDER || 'polygon').toLowerCase();
  const hasKey = provider === 'finnhub'
    ? Boolean(process.env.FINNHUB_API_KEY)
    : Boolean(process.env.POLYGON_API_KEY);

  return {
    statusCode: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store'
    },
    body: JSON.stringify({
      ok: true,
      service: 'innd-website',
      build_sha: process.env.COMMIT_REF || process.env.NETLIFY_COMMIT_REF || 'local',
      branch: process.env.BRANCH || 'local',
      deploy_id: process.env.DEPLOY_ID || 'local',
      quote_provider: provider,
      quote_provider_key_configured: hasKey,
      ts: new Date().toISOString()
    })
  };
};
