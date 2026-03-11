// ==========================================
// PORTFOLIO AI BACKEND (Gemini 2.5 REST)
// ==========================================
// This serverless function securely handles the API request
// ensuring API key is never exposed to the browser.

exports.handler = async function(event, context) {
    // --- 1. SET CORS HEADERS ---
    // Allow the frontend to communicate with this function safely
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
    };

    // --- 2. HANDLE PREFLIGHT (OPTIONS) ---
    // Browsers send an OPTIONS request before POST to check permissions
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers,
            body: ""
        };
    }

    // --- 3. METHOD VALIDATION ---
    // Strictly enforce POST requests only for data mutation/fetching
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: "Method Not Allowed" })
        };
    }

    try {
        // --- 4. PARSE FRONTEND PAYLOAD ---
        // Extract the 'prompt' variable sent from script.js
        const { prompt } = JSON.parse(event.body);

        // --- 5. RETRIEVE ENVIRONMENT VARIABLE ---
        // Pull the API key from Netlify's secure environment
        const API_KEY = process.env.GEMINI_API_KEY;

        // Validate the key exists before proceeding to prevent silent failures
        if (!API_KEY) {
            throw new Error("Missing GEMINI_API_KEY in Netlify environment variables.");
        }

        // --- 6. CONSTRUCT API ENDPOINT ---
        // Use the Gemini 2.5 Flash REST endpoint, trimming the key to remove hidden spaces
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY.trim()}`;

        // --- 7. EXECUTE NATIVE FETCH ---
        // Send the formatted payload directly to Google's servers natively
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        // Parse the raw JSON response from Google
        const data = await response.json();

        // --- 8. SEND RESPONSE TO FRONTEND ---
        // Return the entire data object to script.js for parsing on the client side
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(data)
        };

    } catch (error) {
        // Log the exact error to the Netlify CLI for local debugging
        console.error("--- PORTFOLIO AI FETCH ERROR ---", error);
        
        // Return a 500 status with a safe error message
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: "Failed to connect to the Integration Engine." })
        };
    }
};