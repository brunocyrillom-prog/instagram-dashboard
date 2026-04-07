export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const TOKEN = process.env.IG_TOKEN;
  const IG_ID = process.env.IG_ID;
  if (!TOKEN || !IG_ID) return res.status(500).json({ error: 'Env vars missing' });
  const { endpoint } = req.query;
  const BASE = 'https://graph.facebook.com/v18.0';
  try {
    let url;
    if (endpoint === 'profile') url = `${BASE}/${IG_ID}?fields=name,username,followers_count,follows_count,media_count,biography&access_token=${TOKEN}`;
    else if (endpoint === 'media') url = `${BASE}/${IG_ID}/media?fields=id,caption,media_type,thumbnail_url,media_url,timestamp,like_count,comments_count&limit=12&access_token=${TOKEN}`;
    else return res.status(400).json({ error: 'Invalid endpoint' });
    const r = await fetch(url);
    const data = await r.json();
    return res.status(200).json(data);
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
