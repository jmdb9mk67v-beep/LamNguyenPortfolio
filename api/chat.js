/**
 * Vercel Serverless Handler for Mint & Measure AI
 * Includes CORS configuration to allow local testing
 * and production access from the portfolio domain.
 */
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods", 
    "POST, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers", 
    "Content-Type"
  );

  /**
   * Preflight Check Handler
   * Intercepts browser OPTIONS request to verify CORS 
   * and sends a 200 OK immediately.
   */
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  /**
   * Method Validation
   * Strictly restricts endpoint access to POST requests.
   */
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    /**
     * Payload Parsing and Key Validation
     * Secures the environment key and prepares user data.
     */
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error("CRITICAL: Missing API Key.");
      return res.status(500).json({
        error: "Configuration error."
      });
    }

    const requestBody = typeof req.body === "string" 
      ? JSON.parse(req.body) 
      : req.body;
      
    const userPrompt = requestBody.prompt;

    /**
     * Gemini API Fetch
     * Connects securely server-to-server to prevent 
     * frontend credential exposure.
     */
    const geminiUrl = 
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(
      geminiUrl,
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          contents: [
            { 
              parts: [{ text: userPrompt }] 
            }
          ]
        })
      }
    );

    const responseData = await geminiResponse.json();

    if (!geminiResponse.ok) {
      console.error("Gemini API Error:", responseData);
      return res.status(geminiResponse.status).json(
        responseData
      );
    }

    /**
     * Success Payload
     * Sends the Gemini data securely back to the frontend.
     */
    return res.status(200).json(responseData);

  } catch (errorLog) {
    console.error("Function Crash Logic:", errorLog.message);
    return res.status(500).json({
      error: "Internal Server Error",
      details: errorLog.message
    });
  }
}