/**
 * Vercel Serverless Handler: Stateful Sam Bridge
 */
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const requestBody = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    /* Extract the new keys we added to script.js */
    const { history = [], prompt, systemInstruction } = requestBody;

    /* Map history into the format Gemini expects */
    const contents = history.map(item => ({
      role: item.role === "user" ? "user" : "model",
      parts: [{ text: item.content }]
    }));

    /* Add the current message */
    contents.push({ role: "user", parts: [{ text: prompt }] });

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: contents,
        /* This is the line that tells the AI it is SAM and LAM is the boss */
        system_instruction: {
          parts: [{ text: systemInstruction }]
        },
        generationConfig: {
          temperature: 0.8 
        }
      })
    });

    const data = await geminiResponse.json();
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}