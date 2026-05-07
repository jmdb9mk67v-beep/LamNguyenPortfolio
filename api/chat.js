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
      details: "Focusing on technical development and Zoho Zia Agent."
    },
    {
      role: "Realtor & Accommodation Manager",
      company: "Independent",
      details: "Managed client relations and high-value logistics."
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
      focus: "Geopolitical data engine tracking gas prices."
    },
    {
      title: "Mint & Measure",
      focus: "Culinary web suite featuring API-driven management."
    },
    {
      title: "Heartland Harmony",
      focus: "High-fidelity UI/UX prototype for country music fest."
    }
  ],
  systemDirective: `You are Sam, Lam's digital assistant. 
  Answer professionally using this data: `
};
// lamKnowledgeBaseExport


export default async function handler(req, res) {
  /* --- 1. PRE-FLIGHT & SECURITY GATEKEEPER --- */
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  
  if (req.method !== "POST") {
    return res.status(405).json({ 
      error: "Method not allowed. Use POST." 
    });
  }

  try {
    /* --- 2. ENVIRONMENT & PAYLOAD VALIDATION --- */
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("FATAL: GEMINI_API_KEY is missing.");
      return res.status(500).json({ 
        error: "Server configuration error." 
      });
    }

    const requestBody = typeof req.body === "string" 
      ? JSON.parse(req.body) 
      : req.body;

    const { 
      history = [], 
      prompt 
    } = requestBody;

    if (!prompt) {
      return res.status(400).json({ 
        error: "No prompt provided." 
      });
    }

    /* --- 3. PAYLOAD ARCHITECTURE (The Sandwich) --- */
    const contents = history.map((item) => ({
      role: item.role === "user" ? "user" : "model",
      parts: [{ text: item.content }]
    }));

    contents.push({ 
      role: "user", 
      parts: [{ text: prompt }] 
    });

    /* --- 4. SECURE TRANSMISSION TO GOOGLE --- */
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    /* Combine directive with stringified data */
    const fullInstruction = `
      ${lamKnowledge.systemDirective} 
      ${JSON.stringify(lamKnowledge)}
    `;

    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: contents,
        system_instruction: {
          parts: [{ text: fullInstruction }]
        },
        generationConfig: {
          temperature: 0.75,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 800
        }
      })
    });

    const data = await geminiResponse.json();

    /* --- 5. RESPONSE INTEGRITY CHECK --- */
    if (!geminiResponse.ok) {
      console.error("Gemini API Error:", data);
      return res.status(geminiResponse.status).json(data);
    }

    if (!data.candidates || data.candidates.length === 0) {
      return res.status(200).json({
        candidates: [{ 
          content: { 
            parts: [{ 
              text: "I cannot fulfill this request right now." 
            }] 
          } 
        }]
      });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error("Handler Crash:", err.message);
    return res.status(500).json({ 
      error: "Internal Server Error", 
      details: err.message 
    });
  }
}
// lamBackendChatLogicWired