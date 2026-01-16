// === AI Chatbox (Lam Studios: The Ultimate Hybrid Persona) ===

// 🔑 API Configuration
// Points to your secure Netlify "Brain"
const CHAT_ENDPOINT = 'https://reliable-dragon-75ea77.netlify.app/.netlify/functions/fetchAI'; 

// References (Updated ID to match HTML)
const chatToggle = document.querySelector('#chatToggle');
const chatBox = document.querySelector('#chatBox');
const chatMessages = document.querySelector('#chatMessages');
const chatInput = document.querySelector('#chatInput');
const sendBtn = document.querySelector('#sendChat'); // CHANGED from #sendBtn

// 1. Toggle Chat Visibility
if (chatToggle) {
  chatToggle.addEventListener('click', function() {
    // Check if it's currently block (visible) or not
    const isVisible = chatBox.style.display === 'block';
    
    // Toggle between 'none' and 'block'
    chatBox.style.display = isVisible ? 'none' : 'block';
    
    // Auto-focus input when opening
    if (!isVisible) {
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
  const userMsg = document.createElement('p');
  userMsg.classList.add('user-message');
  userMsg.textContent = message;
  chatMessages.appendChild(userMsg);

  // B. Reset UI
  chatInput.value = '';
  
  // FORCE SCROLL: Tiny delay ensures CSS has applied before scrolling
  setTimeout(() => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 10);

  // C. Disable Input
  chatInput.disabled = true;
  sendBtn.disabled = true;
  sendBtn.style.backgroundColor = "#ccc";
  
  // D. Call the AI
  fetchAIResponse(message);
}

// 4. Fetch Response from Netlify
function fetchAIResponse(message) {
  const aiMsg = document.createElement('p');
  aiMsg.classList.add('ai-message');
  aiMsg.textContent = "...";
  chatMessages.appendChild(aiMsg);
  
  // Scroll to show the "..."
  setTimeout(() => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 10);

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
      - The Founder: Lam Nguyen is a developer based in London, Ontario, known for clean code and modern aesthetics.
      - Contact: If someone wants to hire or contact Lam, tell them to email or use the contact form.
      
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

  const fullPrompt = systemInstruction + message;

  const payload = { prompt: fullPrompt };
  
  fetch(CHAT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload) 
    })
    .then(response => response.json()) 
    .then(data => {
      let aiResponseText = "System Error: No response generated.";
      if (data.candidates && data.candidates.length > 0) {
          aiResponseText = data.candidates[0].content.parts[0].text;
      } else if (data.error) {
          aiResponseText = "Connection Error: " + data.error.message;
      }
      aiMsg.textContent = aiResponseText;
    })
    .catch(error => {
      aiMsg.textContent = "Network unreachable.";
    })
    .finally(() => {
        chatInput.disabled = false;
        sendBtn.disabled = false;
        sendBtn.style.backgroundColor = "#ff3366";
        chatInput.focus();
        
        // CRITICAL FIX: Scroll again after text loads
        setTimeout(() => {
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 50);
    });
}