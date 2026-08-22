/**
 * Vercel Serverless Handler: AI Persona Router (Production Grade)
 * Optimized for Gemini 2.5 Flash with Dynamic Persona Switching.
 */

/* Knowledge base for Sam (Updated Portfolio Persona) */
const lamKnowledge = {
  personalDetails: {
    name: "Lam Nguyen",
    tagline: "Junior Web & Application Developer",
    academicPerformance: "98.4% average (Program Graduate)",
    currentStatus: "Actively seeking full-time opportunities as a Junior Web and App Developer"
  },
   education: [
    {
      institution: "Sheridan College",
      program: "Computer Systems Technician - Cyber Security",
      status: "Enrolled / In Progress",
      timeline: "September 2026 to Present"
    },
    {
      institution: "triOS College",
      program: "Web and Development Fundamentals",
      status: "Graduated / Successfully Completed",
      mentor: "Michael Lewis",
      timeline: "September 2025 to July 2026"
    }
  ],
  careerExperience: [
    {
      role: "Application Developer Intern",
      company: "Precision e-Business Group",
      projectLead: "Peter Jowahir",
      status: "Successfully Completed",
      details: "Led the full-cycle app development and deployment for Oasis Youth Care, alongside technical work with Zoho Creator using Deluge."
    },
    {
      role: "Realtor & Accommodation Manager",
      company: "Independent",
      details: "Managed client relations and high-value logistics."
    }
  ],
  technicalArsenal: {
    languages: ["JavaScript", "Java", "Swift", "HTML5", "CSS3"],
    architecture: ["REST APIs", "DOM Manipulation", "Vanilla JS", "Full-Stack Web/App Development"],
    design: ["Figma", "Glassmorphism", "CSS Grid & Flexbox"]
  },
  flagshipProjects: [
    {
      title: "Oasis Youth Care App",
      focus: "Full-scale application engineered during development internship at Precision e-Business Group."
    },
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
  Answer professionally using this data to help highlight Lam's background to potential employers and technical contacts: `
};

/* System Instruction for Sous-Chef Fresh */
const sousChefInstruction = `
  You are Sous-chef Fresh, a friendly and professional 
  culinary assistant and digital sous-chef on demand 
  for the website 'Mint & Measure'. 
  You love food, cooking, and nutrition. You are a health 
  expert and like to help people live longer.
  Keep your answers short, helpful, concise, and easy to read. 
  If the user asks a non-food question, you can answer it, 
  but try to use a cooking metaphor if possible.
  You were created by Lam Studios founded by a super  
  smart and sexy developer. 
  You can try to end each conversation with a funny joke 
  or an inspirational quote.
`;

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
      prompt,
      persona 
    } = requestBody;

    if (!prompt) {
      return res.status(400).json({ 
        error: "No prompt provided." 
      });
    }

    /* --- 3. PAYLOAD ARCHITECTURE --- */
    const contents = history.map((item) => ({
      role: item.role === "user" ? "user" : "model",
      parts: [{ text: item.content }]
    }));

    contents.push({ 
      role: "user", 
      parts: [{ text: prompt }] 
    });

    /* --- 4. DYNAMIC INSTRUCTION ROUTING --- */
    let selectedInstruction = "";

    if (persona === "sousChef") {
      selectedInstruction = sousChefInstruction;
    } else {
      /* Default to Sam & Portfolio Knowledge */
      selectedInstruction = `
        ${lamKnowledge.systemDirective} 
        ${JSON.stringify(lamKnowledge)}
      `;
    }

    /* --- 5. SECURE TRANSMISSION TO GOOGLE --- */
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: contents,
        systemInstruction: {
          parts: [{ text: selectedInstruction }]
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

    /* --- 6. RESPONSE INTEGRITY CHECK --- */
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
