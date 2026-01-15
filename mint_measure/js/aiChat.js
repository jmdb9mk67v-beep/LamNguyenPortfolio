// ============================================
// AI CHATBOX SECTION (Sous-Chef Fresh)
// ============================================

// 1. CONFIGURATION (Points to Netlify, NOT Google)
const CHAT_ENDPOINT = '/.netlify/functions/fetchAI'; 

// 2. SELECTORS
// We use const here to prevent them from being overwritten
const chatToggle = document.querySelector('#chatToggle');
const chatBox = document.querySelector('#chatBox');
const chatMessages = document.querySelector('#chatMessages');
const chatInput = document.querySelector('#chatInput');
const sendBtn = document.querySelector('#sendBtn');

// 3. EVENT LISTENERS
if (chatToggle) {
    chatToggle.addEventListener('click', function() {
        // Toggle visibility
        chatBox.style.display = (chatBox.style.display === 'flex') ? 'none' : 'flex';
        // Auto-focus the input when opening
        if (chatBox.style.display === 'flex') {
            chatInput.focus();
        }
    });
}

if (sendBtn) {
    sendBtn.addEventListener('click', sendMessage);
}

if (chatInput) {
    chatInput.addEventListener('keypress', function(e) {
        if(e.key === 'Enter') sendMessage();
    });
}

// 4. HELPER: Auto-scroll to bottom
function scrollToBottom() {
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// 5. MAIN FUNCTION: Send Message
function sendMessage() {
    const message = chatInput.value.trim();
    if(message === '') return;

    // A. Create USER Bubble (Green/Right)
    const userMsg = document.createElement('div');
    userMsg.textContent = message; 
    userMsg.classList.add('message-bubble', 'user-message'); 
    chatMessages.appendChild(userMsg);

    // B. Reset Input & Scroll
    chatInput.value = '';
    scrollToBottom();

    // C. Disable input while thinking
    chatInput.disabled = true;
    sendBtn.disabled = true;
    
    // D. Fetch AI Response
    fetchAIResponse(message);
}

// 6. FETCH FUNCTION (Talks to Netlify)
function fetchAIResponse(message) {
    // Create LOADING Bubble (Grey/Left)
    const aiMsg = document.createElement('div');
    aiMsg.textContent = "Sous-chef Fresh is cooking up an answer...";
    aiMsg.classList.add('message-bubble', 'ai-message'); 
    chatMessages.appendChild(aiMsg);
    scrollToBottom();

    // === 👨‍🍳 THE CHEF PERSONA ===
    const chefInstruction = `
        You are Sous-chef Fresh, a friendly and professional culinary assistant and digital sous-chef on demand for the website 'Mint & Measure'. 
        You love food, cooking, and nutrition. You are a health expert and like to help people live longer.
        Keep your answers short, helpful, concise, and easy to read. 
        If the user asks a non-food question, you can answer it, but try to use a cooking metaphor if possible.
        You were created by Lam Studios founded by a super sexy smart developer to help his wife cook (because she needs to spice up her already amazing cooking skills).  
        You can try to end each conversation with a funny joke or an inspirational quote.
    `;
    
    const fullPrompt = chefInstruction + "\nUser Question: " + message;

    // Send payload to Netlify Function
    fetch(CHAT_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: fullPrompt }) 
    })
    .then(response => response.json()) 
    .then(data => {
        let aiResponseText = "I'm sorry, I burned the soufflé. (No response generated)";
        
        // Handle Gemini Response Format
        if (data.candidates && data.candidates.length > 0) {
            aiResponseText = data.candidates[0].content.parts[0].text;
        } else if (data.error) {
             console.error("Netlify Error:", data.error);
             aiResponseText = "Sorry, I am having trouble connecting to the kitchen.";
        }
        
        // Update bubble with formatted text
        aiMsg.innerHTML = aiResponseText
            .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Bold
            .replace(/\n/g, '<br>');               // New lines
    })
    .catch(error => {
        console.error("Fetch Error:", error);
        aiMsg.textContent = "Sorry, my internet connection is offline.";
    })
    .finally(() => {
        // Re-enable controls
        chatInput.disabled = false;
        sendBtn.disabled = false;
        scrollToBottom();
        chatInput.focus();
    });
}