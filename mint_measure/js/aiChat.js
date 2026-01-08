// === AI Chatbox (ChefBot Persona + iPhone Bubbles) ===

// 🔑 Gemini API Configuration
// API Key removed for GitHub migration.  Re-integration pending.
const API_KEY = "REMOVED_FOR_SECURITY";

// Using your preferred version: 2.5-flash
const CHAT_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + API_KEY;

// References
let chatToggle = document.querySelector('#chatToggle');
let chatBox = document.querySelector('#chatBox');
let chatMessages = document.querySelector('#chatMessages');
let chatInput = document.querySelector('#chatInput');
let sendBtn = document.querySelector('#sendBtn');

// Toggle chat visibility
chatToggle.addEventListener('click', function() {
  chatBox.style.display = (chatBox.style.display === 'flex') ? 'none' : 'flex';
});

// Send message on button click or Enter key
sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', function(e) {
  if(e.key === 'Enter') sendMessage();
});

// Handle sending message
function sendMessage() {
  let message = chatInput.value.trim();
  if(message === '') return;

  // 1. Create USER Bubble (Green/Right)
  let userMsg = document.createElement('div');
  userMsg.textContent = message; 
  userMsg.classList.add('message-bubble', 'user-message'); 
  chatMessages.appendChild(userMsg);

  chatInput.value = '';
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // 2. Disable input
  chatInput.disabled = true;
  sendBtn.disabled = true;
  
  // 3. Call Gemini API
  fetchAIResponse(message);
}

// Fetch AI response
function fetchAIResponse(message) {
  // --- Create LOADING Bubble (Grey/Left) ---
  let aiMsg = document.createElement('div');
  aiMsg.textContent = "Sous-chef Fresh is cooking up an answer...";
  aiMsg.classList.add('message-bubble', 'ai-message'); 
  chatMessages.appendChild(aiMsg);
  
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // === 👨‍🍳 THE CHEF PERSONA ===
  // We prepend this instruction to whatever the user types.
  const chefInstruction = `
      You are Sous-chef Fresh, a friendly and professional culinary assistant and digital sous-chef on demand for the website 'Mint & Measure'. 
      You love food, cooking, and nutrition. You are a health expert and like to help people live longer.
      Keep your answers short, helpful, concise, and easy to read. 
      If the user asks a non-food question, you can answer it, but try to use a cooking metaphor if possible.
      You were created by Lam Studios founded by a super sexy smart developer to help his wife cook (because she needs to spice up her already amazing cooking skills).  
      You can try to end each conversation with a funny joke or an inspirational quote.
      
      User Question: 
  `;
  
  const fullPrompt = chefInstruction + message;

  const payload = {
      contents: [{ parts: [{ text: fullPrompt }] }]
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
      let aiResponseText = "I'm sorry, I burned the soufflé. (No response generated)";
      
      if (data.candidates && data.candidates.length > 0) {
          aiResponseText = data.candidates[0].content.parts[0].text;
      } 
      
      // Update text with HTML formatting
      aiMsg.innerHTML = aiResponseText
          .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Bold
          .replace(/\n/g, '<br>');               // New lines
    })
    .catch(error => {
      console.error("Gemini API Error:", error);
      aiMsg.textContent = "Sorry, my internet connection is offline.";
    })
    .finally(() => {
        chatInput.disabled = false;
        sendBtn.disabled = false;
        chatMessages.scrollTop = chatMessages.scrollHeight;
        chatInput.focus();
    });
}