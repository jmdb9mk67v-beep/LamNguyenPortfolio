/* I am establishing the secure Vercel backend bridge.
   This prevents GEMINI_API_KEY from being exposed
   in the browser's Network tab. 
*/
export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = JSON.parse(req.body);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Bridge failure' });
  }
}