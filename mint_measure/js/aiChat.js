/**
 * AI Chatbox Section (Sous-Chef Fresh)
 * Configuration and DOM Selectors.
 */
const CHAT_ENDPOINT = 'https://lam-nguyen-portfolio-three.vercel.app/api/chat';
const chatToggle = document.querySelector('#chatToggle');
const chatBox = document.querySelector('#chatBox');
const chatMessages = document.querySelector('#chatMessages');
const chatInput = document.querySelector('#chatInput');
const sendBtn = document.querySelector('#sendBtn');

/**
 * Event Listeners Initialization.
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
 */
function scrollToBottom() {
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

/**
 * Main Function: Send Message.
 */
function sendMessage() {
    const message = chatInput.value.trim();
    if(message === '') return;

    const userMsg = document.createElement('div');
    userMsg.textContent = message; 
    
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
 * Connects to Vercel backend using the 'sousChef' persona.
 */
function fetchAIResponse(message) {
    const aiMsg = document.createElement('div');
    aiMsg.textContent = "Sous-chef Fresh is cooking up an answer...";
      
    aiMsg.classList.add('message-bubble', 'ai-message'); 
    chatMessages.appendChild(aiMsg);
    scrollToBottom();

    fetch(CHAT_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            prompt: message,
            persona: 'sousChef'
        }) 
    })
    .then(response => response.json()) 
    .then(data => {
        let aiResponseText = 
          "I'm sorry, I burned the soufflé. (No response generated)";
        
        if (data.candidates && data.candidates.length > 0) {
            aiResponseText = 
              data.candidates[0].content.parts[0].text;
        } else if (data.error) {
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