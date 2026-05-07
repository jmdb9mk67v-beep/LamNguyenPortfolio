/**
 * Vercel Serverless Handler: Sam AI Bridge (Production Grade)
 * Optimized for Gemini 2.5 Flash with Stateful Memory.
 */

const lamKnowledge = {
  personalDetails: {
    name: "Lam Nguyen",
    tagline: "Web & Application Developer",
    academicPerformance: "98% average",
    currentStatus: "Available for technical inquiries"
  },
  education: {
    institution: "triOS College",
    program: "Web and Development Fundamentals",
    mentor: "Michael Lewis",
    timeline: "September 2025 to July 2026"
  },
  careerExperience: [
    {
      role: "Application Developer Intern",
      company: "Precision e-Business Group",
      projectLead: "Peter Jowahir",
      startDate: "May 18, 2026",
      details: "Focusing on technical development and Zoho Zia Agent integration."
    },
    {
      role: "Realtor & Accommodation Manager",
      company: "Independent",
      details: "Managed client relations and high-value property logistics."
    }
  ],
  technicalArsenal: {
    languages: ["JavaScript", "Java", "Swift", "HTML5", "CSS3"],
    architecture: ["REST APIs", "DOM Manipulation", "Vanilla JS"],
    design: ["Figma", "Glassmorphism", "CSS Grid & Flexbox"]
  },
  flagshipProjects: [
    {
      title: "Conflict to Pump",
      focus: "Geopolitical data engine tracking global conflicts vs Canadian gas prices."
    },
    {
      title: "Mint & Measure",
      focus: "Culinary web suite featuring API-driven ingredient management."
    },
    {
      title: "Heartland Harmony",
      focus: "High-fidelity UI/UX prototype for a country music festival."
    }
  ],
  systemDirective: "You are an AI assistant representing Lam Nguyen. Answer questions concisely and professionally based strictly on this dataset."
};
// lamKnowledgeBaseExport


export default async function handler(req, res) {
  /* --- 1. PRE-FLIGHT & SECURITY GATEKEEPER --- */
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    /* --- 2. ENVIRONMENT & PAYLOAD VALIDATION --- */
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("FATAL: GEMINI_API_KEY is missing in Vercel settings.");
      return res.status(500).json({ error: "Server configuration error." });
    }

    const requestBody = typeof req.body === "string" 
      ? JSON.parse(req.body) 
      : req.body;

    const { 
      history = [], 
      prompt, 
      systemInstruction 
    } = requestBody;

    if (!prompt) {
      return res.status(400).json({ error: "No prompt provided." });
    }

    /* --- 3. PAYLOAD ARCHITECTURE (The Sandwich) --- */
    /* Gemini requires alternating roles: user -> model -> user */
    const contents = history.map((item) => ({
      role: item.role === "user" ? "user" : "model",
      parts: [{ text: item.content }]
    }));

    /* Append the fresh user query to the history chain */
    contents.push({ 
      role: "user", 
      parts: [{ text: prompt }] 
    });

    /* --- 4. SECURE TRANSMISSION TO GOOGLE --- */
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: contents,
        system_instruction: {
          parts: [{ text: systemInstruction || "You are Sam, a helpful and friendly assistant." }]
        },
        generationConfig: {
          temperature: 0.75,   /* Balance between creative & factual */
          topP: 0.95,          /* High diversity of word choice */
          topK: 40,            /* Limits 'hallucinations' */
          maxOutputTokens: 800 /* Prevents overly long, expensive responses */
        }
      })
    });

    const data = await geminiResponse.json();

    /* --- 5. RESPONSE INTEGRITY CHECK --- */
    if (!geminiResponse.ok) {
      console.error("Gemini API Error:", data);
      return res.status(geminiResponse.status).json(data);
    }

    /* Handle edge case where Google blocks the response for safety */
    if (!data.candidates || data.candidates.length === 0) {
      return res.status(200).json({
        candidates: [{ 
          content: { 
            parts: [{ text: "I cannot fulfill this request due to safety filters." }] 
          } 
        }]
      });
    }

    /* Return the verified data to the frontend */
    return res.status(200).json(data);

  } catch (err) {
    console.error("Handler Crash:", err.message);
    return res.status(500).json({ 
      error: "Internal Server Error", 
      details: err.message 
    });
  }
}