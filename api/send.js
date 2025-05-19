export default async function handler(req, res) {
  const secret = req.headers['authorization'];
  const expected = process.env.SECRET_KEY;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (secret !== expected) {
    return res.status(403).json({ error: 'Forbidden: Invalid token' });
  }

  const data = req.body;

  try {
    const webhook = process.env.DISCORD_WEBHOOK_URL;

    const response = await fetch(webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to send webhook' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Unexpected error' });
  }
}
