module.exports = async function handler(req, res) {
  var apiUrl = process.env.BRAZINO_API_URL;
  if (!apiUrl) { res.status(503).json({ error: 'API not configured' }); return; }
  try {
    var r = await fetch(apiUrl + '/api/leaderboard');
    if (!r.ok) throw new Error('Upstream ' + r.status);
    var data = await r.json();
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
    res.json(data);
  } catch (e) {
    console.error('Leaderboard proxy:', e.message);
    res.status(500).json({ error: 'Failed' });
  }
};