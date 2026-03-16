/**
 * AI Chatbox Section (Sous-Chef Fresh)
 * Configuration and DOM Selectors.
 * We are keeping the legacy naming conventions 
 * (CHAT_ENDPOINT) as specifically requested.
 */
const CHAT_ENDPOINT = 'https://lam-nguyen-portfolio-three.vercel.app/api/chat';
const chatToggle = document.querySelector('#chatToggle');
const chatBox = document.querySelector('#chatBox');
const chatMessages = document.querySelector('#chatMessages');
const chatInput = document.querySelector('#chatInput');
const sendBtn = document.querySelector('#sendBtn');

/**
 * Event Listeners Initialization.
 * Handles UI toggles and enter key presses.
 */
if (chatToggle) {
    chatToggle.addEventListener('click', function() {
        chatBox.style.display = 
          (chatBox.style.display === 'flex') ? 'none' : 'flex';
          
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

/**
 * DOM Helper.
 * Auto-scrolls the chat window to the newest message.
 */
function scrollToBottom() {
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

/**
 * Main Function: Send Message.
 * Captures user input, builds the UI bubble, 
 * and triggers the Vercel fetch request.
 */
function sendMessage() {
    const message = chatInput.value.trim();
    if(message === '') return;

    const userMsg = document.createElement('div');
    userMsg.textContent = message; 
    
    // Retaining kebab-case as requested
    userMsg.classList.add('message-bubble', 'user-message'); 
    chatMessages.appendChild(userMsg);

    chatInput.value = '';
    scrollToBottom();

    chatInput.disabled = true;
    sendBtn.disabled = true;
    
    fetchAIResponse(message);
}

/**
 * Fetch Function.
 * Talks directly to the new Vercel backend.
 * Console logs updated to reflect the new host.
 */
function fetchAIResponse(message) {
    const aiMsg = document.createElement('div');
    aiMsg.textContent = 
      "Sous-chef Fresh is cooking up an answer...";
      
    // Retaining kebab-case as requested
    aiMsg.classList.add('message-bubble', 'ai-message'); 
    chatMessages.appendChild(aiMsg);
    scrollToBottom();

    const chefInstruction = `
        You are Sous-chef Fresh, a friendly and professional 
        culinary assistant and digital sous-chef on demand 
        for the website 'Mint & Measure'. 
        You love food, cooking, and nutrition. You are a health 
        expert and like to help people live longer.
        Keep your answers short, helpful, concise, and easy to read. 
        If the user asks a non-food question, you can answer it, 
        but try to use a cooking metaphor if possible.
        You were created by Lam Studios founded by a super  
        smart developer. 
        You can try to end each conversation with a funny joke 
        or an inspirational quote.
    `;
    
    const fullPrompt = 
      chefInstruction + "\nUser Question: " + message;

    fetch(CHAT_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: fullPrompt }) 
    })
    .then(response => response.json()) 
    .then(data => {
        let aiResponseText = 
          "I'm sorry, I burned the soufflé. (No response generated)";
        
        if (data.candidates && data.candidates.length > 0) {
            aiResponseText = 
              data.candidates[0].content.parts[0].text;
        } else if (data.error) {
             // Updated error log for Vercel
             console.error("Vercel Error:", data.error);
             aiResponseText = 
               "Sorry, I am having trouble connecting to the kitchen.";
        }
        
        aiMsg.innerHTML = aiResponseText
            .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
            .replace(/\n/g, '<br>');               
    })
    .catch(error => {
        console.error("Fetch Error:", error);
        aiMsg.textContent = 
          "Sorry, my internet connection is offline.";
    })
    .finally(() => {
        chatInput.disabled = false;
        sendBtn.disabled = false;
        scrollToBottom();
        chatInput.focus();
    });
}