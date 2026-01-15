exports.handler = async function(event, context) {
  // === 1. SETUP PERMISSIONS (CORS) ===
  // This allows my GitHub site to talk to this Netlify function
  const headers = {
    "Access-Control-Allow-Origin": "*", // Allow all (or change to "https://lamnguyen.ca" for strict security)
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  // === 2. HANDLE PRE-FLIGHT CHECKS ===
  // Browsers send a "test" request first (OPTIONS). We must say "OK".
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: ""
    };
  }

  // === 3. VALIDATE METHOD ===
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: "Method Not Allowed" };
  }

  // === 4. PROCESS REQUEST ===
  try {
    const { prompt } = JSON.parse(event.body);

    // Get Key from Netlify Vault
    const API_KEY = process.env.GEMINI_API_KEY;
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    // === 5. SEND RESPONSE WITH HEADERS ===
    return {
      statusCode: 200,
      headers, // <--- Important: Send permission slips back
      body: JSON.stringify(data)
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to fetch from Gemini" })
    };
  }
};