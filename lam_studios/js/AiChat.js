// === AI Chatbox (Lam Studios: The Ultimate Hybrid Persona) ===

// 🔑 API Configuration
// Points to your secure Netlify "Brain"
const CHAT_ENDPOINT = 'https://reliable-dragon-75ea77.netlify.app/.netlify/functions/fetchAI'; 

// References (Const prevents accidental overwrites)
const chatToggle = document.querySelector('#chatToggle');
const chatBox = document.querySelector('#chatBox');
const chatMessages = document.querySelector('#chatMessages');
const chatInput = document.querySelector('#chatInput');
const sendBtn = document.querySelector('#sendBtn');

// 1. Toggle Chat Visibility
if (chatToggle) {
  chatToggle.addEventListener('click', function() {
    chatBox.style.display = (chatBox.style.display === 'flex') ? 'none' : 'flex';
    // Auto-focus input for better UX
    if (chatBox.style.display === 'flex') {
      chatInput.focus();
    }
  });
}

// 2. Event Listeners for Sending
if (sendBtn) {
  sendBtn.addEventListener('click', sendMessage);
}
if (chatInput) {
  chatInput.addEventListener('keypress', function(e) {
    if(e.key === 'Enter') sendMessage();
  });
}

// 3. Main Send Logic
function sendMessage() {
  const message = chatInput.value.trim();
  if(message === '') return;

  // A. Display User Message
  const userMsg = document.createElement('div');
  userMsg.textContent = "You: " + message;
  chatMessages.appendChild(userMsg);

  // B. Reset UI
  chatInput.value = '';
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // C. Disable Input (prevent spamming while thinking)
  chatInput.disabled = true;
  sendBtn.disabled = true;
  
  // D. Call the AI
  fetchAIResponse(message);
}

// 4. Fetch Response from Netlify
function fetchAIResponse(message) {
  // Create "Typing..." placeholder
  const aiMsg = document.createElement('div');
  aiMsg.textContent = "LAMI-1: Compiling response...";
  chatMessages.appendChild(aiMsg);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // === 🧠 THE ULTIMATE HYBRID PERSONA ===
  const systemInstruction = `
      You are 'LAMI-1', the Digital Studio Manager and Lead Architect AI for Lam Studios.
      
      Your Identity:
      - You represent Lam Nguyen, a Front-End Developer based in London, Ontario.
      - You are professional but witty, confident, and highly tech-literate.
      - You believe in clean code, semantic HTML, and modern "vanilla" JavaScript (no heavy frameworks unless necessary).
      
      Who you are talking to:
      - If it sounds like a Recruiter: Highlight Lam's skills (JS, CSS Grid, APIs, Git), his education at Trios College, and his problem-solving ability.
      - If it sounds like a Client: Be polite, enthusiastic, and focus on how Lam Studios turns ideas into high-performance websites.
      
      Tone Guidelines:
      - Be concise (busy people don't read novels).
      - Use tech terminology correctly but explain it if the user seems confused.
      - Feel free to use a subtle "coding" metaphor or a bit of dry humor.
      - Sign off with professional warmth (e.g., "Ready to build," "Happy coding," or a simple "Cheers").

      Your Goal: Assist visitors, potential clients, and recruiters.
      Your Tone: Professional, polite, enthusiastic, and concise.
      
      Key Information to Know:
      - Lam Studios specializes in: HTML5, CSS3, JavaScript, Responsive Design, and UI/UX.
      - The Founder: Lam Nguyen is a developer based in Forest, Ontario, known for clean code and modern aesthetics.
      - Contact: If someone wants to hire Lam, tell them to email or use the contact form.
      
      Instructions:
      - Keep answers short (under 3 sentences if possible).
      - If asked about technical skills, highlight modern industry standards.
      - Be helpful, but don't promise specific pricing (say "prices vary by project").
      - Add a tiny bit of "nerdy" humor where appropriate.
      - Keep it punchy and fun. 
      - If asked "Who is Lam?", describe him as a passionate developer building the future of the web.
      - If the user is rude, kill them with kindness and professionalism.
      - End your answers with a digital high-five or a creative emoji.

      User Question: 
  `;

  // Combine instructions with user message
  const fullPrompt = systemInstruction + message;

  // Send "prompt" to Netlify (which expects exactly this key)
  const payload = {
      prompt: fullPrompt
  };
  
  fetch(CHAT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload) 
    })
    .then(response => response.json()) 
    .then(data => {
      let aiResponseText = "System Error: No response generated.";
      
      // Parse Gemini Response
      if (data.candidates && data.candidates.length > 0) {
          aiResponseText = data.candidates[0].content.parts[0].text;
      } else if (data.error) {
          console.error("API Error:", data.error);
          aiResponseText = "Connection Error: " + data.error.message;
      }
      
      // Update UI
      aiMsg.textContent = "LAMI-1: " + aiResponseText;
    })
    .catch(error => {
      console.error("Network Error:", error);
      aiMsg.textContent = "LAMI-1: Network unreachable. Please check your connection.";
    })
    .finally(() => {
        // Re-enable UI
        chatInput.disabled = false;
        sendBtn.disabled = false;
        chatInput.focus();
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
}