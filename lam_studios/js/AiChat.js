// === AI Chatbox ===

// 🔑 Gemini API Configuration 🔑
// Note: The key is placed directly in the code as requested, but remember this is
// insecure for a public website. Use a server-side approach later!
// API key removed for GitHub migration. Re-integration pending. 
const API_KEY = "REMOVED_FOR_SECURITY";
const CHAT_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + API_KEY;

// References (Using querySelector only)
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

  // 1. Show user's message
  let userMsg = document.createElement('div');
  userMsg.textContent = "You: " + message;
  chatMessages.appendChild(userMsg);

  chatInput.value = '';
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // 2. Disable input while waiting for the network
  chatInput.disabled = true;
  sendBtn.disabled = true;
  
  // 3. Call Gemini API
  fetchAIResponse(message);
}

// Fetch AI response from Gemini (Using .then() chain for simplicity)
function fetchAIResponse(message) {
  // Show "AI is typing..." first
  let aiMsg = document.createElement('div');
  aiMsg.textContent = "AI: ...typing...";
  chatMessages.appendChild(aiMsg);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // The required JSON payload structure for the Gemini API
  const payload = {
      contents: [{ parts: [{ text: message }] }]
  };
  
  // Start the API call
  fetch(CHAT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Convert JavaScript object to the JSON string expected by the API
      body: JSON.stringify(payload) 
    })
    
    // STEP 1: Wait for the raw response, then convert it to usable JSON
    .then(response => response.json()) 
    
    // STEP 2: Use the final JSON data
    .then(data => {
      // ⚠️ Key Change: Extract the text from the specific Gemini JSON structure
      let aiResponseText = "Sorry, no response could be generated.";
      
      // Check if the response contains valid text candidates
      if (data.candidates && data.candidates.length > 0) {
          aiResponseText = data.candidates[0].content.parts[0].text;
      } 
      
      aiMsg.textContent = "AI: " + aiResponseText;
    })

    // STEP 3: Handle network failure or parsing errors
    .catch(error => {
      console.error("Gemini API Error:", error);
      aiMsg.textContent = "AI: Sorry, a connection error occurred.";
    })
    
    // STEP 4: Always run this, whether success or failure
    .finally(() => {
        chatInput.disabled = false;
        sendBtn.disabled = false;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
}