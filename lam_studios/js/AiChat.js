// === AI Chatbox (Lam Studios) ===

// 🔑 API Configuration
// We point to my existing secure Netlify backend
const CHAT_ENDPOINT = 'https://reliable-dragon-75ea77.netlify.app/.netlify/functions/fetchAI'; 

// References
const chatToggle = document.querySelector('#chatToggle');
const chatBox = document.querySelector('#chatBox');
const chatMessages = document.querySelector('#chatMessages');
const chatInput = document.querySelector('#chatInput');
const sendBtn = document.querySelector('#sendBtn');

// Toggle chat visibility
if (chatToggle) {
  chatToggle.addEventListener('click', function() {
    chatBox.style.display = (chatBox.style.display === 'flex') ? 'none' : 'flex';
    if (chatBox.style.display === 'flex') {
      chatInput.focus();
    }
  });
}

// Send message on button click or Enter key
if (sendBtn) {
  sendBtn.addEventListener('click', sendMessage);
}
if (chatInput) {
  chatInput.addEventListener('keypress', function(e) {
    if(e.key === 'Enter') sendMessage();
  });
}

// Handle sending message
function sendMessage() {
  const message = chatInput.value.trim();
  if(message === '') return;

  // 1. Show user's message
  const userMsg = document.createElement('div');
  userMsg.textContent = "You: " + message;
  // Optional: Add styling class if your CSS supports it
  // userMsg.classList.add('user-message'); 
  chatMessages.appendChild(userMsg);

  chatInput.value = '';
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // 2. Disable input while waiting
  chatInput.disabled = true;
  sendBtn.disabled = true;
  
  // 3. Call AI
  fetchAIResponse(message);
}

// Fetch AI response
function fetchAIResponse(message) {
  // Show "AI is typing..."
  const aiMsg = document.createElement('div');
  aiMsg.textContent = "AI: ...typing...";
  // aiMsg.classList.add('ai-message');
  chatMessages.appendChild(aiMsg);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // === 🧠 SYSTEM PERSONA ===
  // Customize this for Lam Studios!
  const systemInstruction = `
      Your name is LAMI, super smart and sexy AI "Linked Artificial Mind Intelligence"
      You are the digital assistant for Lam Studios. 
      You are professional, creative, and knowledgeable about web development, design and advanced coding.
      You are constantly learning and evolving into a super AI.
      Keep your answers concise, helpful and friendly.
      
      User Question: 
  `;

  // Combine instructions with user message
  const fullPrompt = systemInstruction + message;

  // Payload: We send "prompt" because that is what our Netlify function expects
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
      let aiResponseText = "Sorry, no response could be generated.";
      
      // Handle the Gemini response structure
      if (data.candidates && data.candidates.length > 0) {
          aiResponseText = data.candidates[0].content.parts[0].text;
      } else if (data.error) {
          console.error("API Error:", data.error);
          aiResponseText = "Error: " + data.error.message;
      }
      
      // Update the bubble text
      aiMsg.textContent = "AI: " + aiResponseText;
    })
    .catch(error => {
      console.error("Network Error:", error);
      aiMsg.textContent = "AI: Sorry, connection failed.";
    })
    .finally(() => {
        chatInput.disabled = false;
        sendBtn.disabled = false;
        chatInput.focus();
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
}