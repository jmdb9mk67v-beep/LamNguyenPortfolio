/* I am using a robust handler to prevent the 500 error. 
   This version checks if req.body is already an object. 
*/
export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Vercel usually parses JSON automatically. We check first.
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const userPrompt = body.prompt;

    if (!apiKey) {
      console.error("CRITICAL: GEMINI_API_KEY is missing in Vercel settings.");
      return res.status(500).json({ error: "API Key configuration error." });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userPrompt }] }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", data);
      return res.status(response.status).json(data);
    }

    // Success: Return the data to your browser
    return res.status(200).json(data);

  } catch (error) {
    // This will now show the EXACT error in your Vercel Logs
    console.error("Function Crash Logic:", error.message);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}