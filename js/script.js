document.addEventListener('DOMContentLoaded', () => {
  
  const element = document.querySelector('.status-message');
  
  if (element) {
    const phrases = [
      "Web Developer",
      "AI Integration Engineer",
      "UI/UX Engineer",
      "Code by Lam",
      "Application Programmer",
      "AI-Driven Solutions",
      "Building Digital Experiences",
      "Mobile Web Developer"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function typeEffect() {
      const currentPhrase = phrases[phraseIndex];
      
      if (isDeleting) {
        element.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50; 
      } else {
        element.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typeSpeed = 2000; 
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500; 
      }

      setTimeout(typeEffect, typeSpeed);
    }

    typeEffect();
  }

  const footerTextElement = document.querySelector('.footer-text');
  const lastUpdatedElement = document.querySelector('.last-updated-date');

  if (footerTextElement) {
      footerTextElement.innerHTML = `&copy; ${new Date().getFullYear()} Lam Nguyen. All rights reserved.`;
  }

  if (lastUpdatedElement) {
      lastUpdatedElement.textContent = new Date(document.lastModified).toLocaleDateString('en-CA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
      });
  }

  document.addEventListener('mousemove', (e) => {
    document.body.style.setProperty('--mouse-offset-x', `${e.clientX / 50}px`);
    document.body.style.setProperty('--mouse-offset-y', `${e.clientY / 50}px`);
  });

  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  if (tabButtons.length > 0 && tabContents.length > 0) {
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        button.classList.add('active');
        const targetId = button.getAttribute('data-target');
        document.querySelector(`#${targetId}`).classList.add('active');
      });
    });
  }

  const projectCards = document.querySelectorAll('.project-card');

  if (projectCards.length > 0) {
    projectCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--px', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--py', `${(y / rect.height) * 100}%`);
        card.style.setProperty('--rx', `${(0.5 - (y / rect.height)) * 8}deg`);
        card.style.setProperty('--ry', `${((x / rect.width) - 0.5) * 8}deg`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--px', '50%');
        card.style.setProperty('--py', '50%');
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }
});

// -----------> Contact Form and AI-Chat <----------------- //

document.addEventListener('DOMContentLoaded', () => {

  // --- FORMSPREE AJAX LOGIC ---
  // I am hijacking the default form submission to send an asynchronous POST request via the Fetch API. 
  // This prevents page reloads, keeps the user in my fluid UI, and allows me to render a custom success state.
  const contactForm = document.querySelector('#contact-form');
  const formStatus = document.querySelector('#form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const url = contactForm.getAttribute('action');
      const formData = new FormData(contactForm);
      
      formStatus.textContent = 'Transmitting...';
      formStatus.style.color = '#fff';

      try {
        const response = await fetch(url, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          contactForm.reset();
          formStatus.textContent = 'Message transmitted successfully. I will be in touch.';
          formStatus.style.color = '#f702c6';
        } else {
          const data = await response.json();
          if (Object.hasOwn(data, 'errors')) {
            formStatus.textContent = data.errors.map(error => error.message).join(', ');
          } else {
            formStatus.textContent = 'Oops! There was a problem transmitting your form.';
          }
          formStatus.style.color = '#f00';
        }
      } catch (error) {
        formStatus.textContent = 'Network error. Please try again later.';
        formStatus.style.color = '#f00';
      }
    });
  }

  // --- AI CHAT WIDGET UI LOGIC ---
  // I handle the visibility toggle of the AI chat window here, updating ARIA attributes 
  // dynamically to maintain strict accessibility standards alongside the visual animations.
  const aiToggleBtn = document.querySelector('#ai-toggle-btn');
  const aiCloseBtn = document.querySelector('#ai-close-btn');
  const aiChatWindow = document.querySelector('#ai-chat-window');
  const aiChatForm = document.querySelector('#ai-chat-form');
  const aiUserInput = document.querySelector('#ai-user-input');
  const aiChatMessages = document.querySelector('#ai-chat-messages');

  const toggleChat = () => {
    aiChatWindow.classList.toggle('active');
    const isOpen = aiChatWindow.classList.contains('active');
    aiToggleBtn.setAttribute('aria-expanded', isOpen);
    
    if (isOpen) {
      aiUserInput.focus();
    }
  };

  if (aiToggleBtn) aiToggleBtn.addEventListener('click', toggleChat);
  if (aiCloseBtn) aiCloseBtn.addEventListener('click', toggleChat);

  // --- 3D TILT ENGINE FOR CHAT WINDOW ---
  // I map the user's cursor coordinates to my CSS variables to drive the hardware-accelerated 
  // 3D tilt and inner light bloom effects. I limit the rotation to a mature 4deg maximum.
  if (aiChatWindow) {
    aiChatWindow.addEventListener('mousemove', (e) => {
      const rect = aiChatWindow.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      aiChatWindow.style.setProperty('--px', `${(x / rect.width) * 100}%`);
      aiChatWindow.style.setProperty('--py', `${(y / rect.height) * 100}%`);
      aiChatWindow.style.setProperty('--rx', `${(0.5 - (y / rect.height)) * 4}deg`);
      aiChatWindow.style.setProperty('--ry', `${((x / rect.width) - 0.5) * 4}deg`);
    });

    aiChatWindow.addEventListener('mouseleave', () => {
      aiChatWindow.style.setProperty('--px', '50%');
      aiChatWindow.style.setProperty('--py', '50%');
      aiChatWindow.style.setProperty('--rx', '0deg');
      aiChatWindow.style.setProperty('--ry', '0deg');
    });
  }

 // --- AI CHAT SUBMISSION (PRODUCTION BRIDGE) ---
  // I am establishing the asynchronous data pipeline to connect my front-end UI 
  // to my secure Netlify serverless backend. This replaces the previous UI mockup 
  // and demonstrates my ability to handle full-stack REST API integrations.
  if (aiChatForm) {
    aiChatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const message = aiUserInput.value.trim();
      if (!message) return;

      // I immediately display the user's query in the chat window to maintain a highly responsive UX.
      const userMsgDiv = document.createElement('div');
      userMsgDiv.className = 'msg user-msg';
      userMsgDiv.textContent = message;
      aiChatMessages.appendChild(userMsgDiv);
      
      aiUserInput.value = '';
      aiChatMessages.scrollTop = aiChatMessages.scrollHeight;

      // I inject a temporary 'processing' state to provide immediate visual feedback 
      // while the serverless function cold-starts or waits for the Gemini API.
      const thinkingDiv = document.createElement('div');
      thinkingDiv.className = 'msg ai-msg';
      thinkingDiv.textContent = 'Processing request...';
      aiChatMessages.appendChild(thinkingDiv);
      aiChatMessages.scrollTop = aiChatMessages.scrollHeight;

      try {
        // I am sending a POST request to my Netlify function endpoint. 
        // I package the user's message as a JSON payload in the body.
        const response = await fetch('/.netlify/functions/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: message })
        });

        // I check if the server responded successfully before attempting to parse the data.
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // I parse the JSON response returned by my chat.js backend function.
        const data = await response.json();
        
        // I replace the 'thinking' text with the actual AI response generated by Gemini.
        if (data.reply) {
          thinkingDiv.textContent = data.reply;
        } else if (data.error) {
          thinkingDiv.textContent = `System Error: ${data.error}`;
        }
      } catch (error) {
        // If the fetch fails (e.g., local server isn't running, or network drops), 
        // I catch the error and display a graceful fallback message.
        thinkingDiv.textContent = 'Connection to the AI integration engine failed. Please try again later.';
        console.error('AI Bridge Error:', error);
      } finally {
        // I ensure the chat window always scrolls to the bottom, regardless of success or failure.
        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
      }
    });
  }
});

// ================> AI CHAT LOGIC LIVES HERE <==================== //

// ==========================================
// AI INTEGRATION ENGINE (FRONTEND LOGIC)
// ==========================================

// --- 1. CONFIGURATION ---
// Pointing strictly to your new, isolated Portfolio AI serverless function
const CHAT_ENDPOINT = '/.netlify/functions/portfolioAI';

// --- 2. DOM SELECTORS ---
// Strictly using querySelector per modern Web Developer standards
const aiToggleBtn = document.querySelector('#ai-toggle-btn');
const aiCloseBtn = document.querySelector('#ai-close-btn');
const aiChatWindow = document.querySelector('#ai-chat-window');
const aiChatForm = document.querySelector('#ai-chat-form');
const aiUserInput = document.querySelector('#ai-user-input');
const aiChatMessages = document.querySelector('#ai-chat-messages');
const aiSubmitBtn = document.querySelector('.ai-submit-btn');

// --- 3. HELPER FUNCTIONS ---
// Keeps the chat container scrolled to the newest message at the bottom
function scrollToBottom() {
    if (aiChatMessages) {
        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    }
}

// --- 4. UI TOGGLE LOGIC ---
// Handles opening the chat widget from the sparkle button
if (aiToggleBtn && aiChatWindow) {
    aiToggleBtn.addEventListener('click', () => {
        // Toggle a utility class for your CSS to animate (Strict separation of concerns!)
        aiChatWindow.classList.add('show-chat');
        
        // Update accessibility attributes for screen readers
        aiToggleBtn.setAttribute('aria-expanded', 'true');
        aiChatWindow.setAttribute('aria-hidden', 'false');
        
        // Auto-focus the input so the user can type immediately
        if (aiUserInput) aiUserInput.focus();
    });
}

// Handles closing the chat widget from the 'X' button
if (aiCloseBtn && aiChatWindow) {
    aiCloseBtn.addEventListener('click', () => {
        aiChatWindow.classList.remove('show-chat');
        
        // Revert accessibility attributes
        aiToggleBtn.setAttribute('aria-expanded', 'false');
        aiChatWindow.setAttribute('aria-hidden', 'true');
    });
}

// --- 5. CHAT SUBMISSION LOGIC ---
if (aiChatForm) {
    aiChatForm.addEventListener('submit', function(e) {
        // Prevent the page from reloading on form submit
        e.preventDefault();
        
        // Grab text and strip trailing whitespace
        const message = aiUserInput.value.trim();
        if (message === '') return;

        // --- A. Render User Bubble ---
        const userMsgDiv = document.createElement('div');
        // Matching your HTML structure: base .msg class + specific .user-msg class
        userMsgDiv.classList.add('msg', 'user-msg'); 
        userMsgDiv.textContent = message;
        aiChatMessages.appendChild(userMsgDiv);

        // --- B. Update UI State ---
        aiUserInput.value = '';
        aiUserInput.disabled = true;
        aiSubmitBtn.disabled = true;
        scrollToBottom();

        // --- C. Render AI Thinking State ---
        const thinkingDiv = document.createElement('div');
        // Using the exact classes from your hardcoded HTML welcome message
        thinkingDiv.classList.add('msg', 'ai-msg'); 
        thinkingDiv.textContent = "Processing logic...";
        aiChatMessages.appendChild(thinkingDiv);
        scrollToBottom();

        // --- D. Persona & Payload Construction ---
        const systemContext = `
            You are Sam, Lam Nguyen's highly advanced digital assistant. 
            Lam is a UI/UX Engineer and Web Developer with a 98% academic average. 
            Keep your answers highly professional, detailed, concise, and positive. 
            Question the user's logic occasionally if appropriate, but always be helpful.
        `;
        const fullPrompt = systemContext + "\nUser Query: " + message;

        // --- E. Execute Backend Fetch ---
        fetch(CHAT_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: fullPrompt }) 
        })
        .then(response => response.json()) 
        .then(data => {
            let aiResponseText = "System Error: Unable to parse AI response.";
            
            // Drill into the Google Gemini 2.5 REST JSON structure
            if (data.candidates && data.candidates.length > 0) {
                aiResponseText = data.candidates[0].content.parts[0].text;
            } else if (data.error) {
                console.error("API Error:", data.error);
                aiResponseText = `Backend Error: ${data.error.message || 'Connection failed.'}`;
            }
            
            // Format markdown to HTML
            thinkingDiv.innerHTML = aiResponseText
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                .replace(/\n/g, '<br>'); 
        })
        .catch(error => {
            console.error("Fetch Error:", error);
            thinkingDiv.textContent = "Critical Error: Connection to the Integration Engine failed.";
        })
        .finally(() => {
            // --- F. Restore UI State ---
            aiUserInput.disabled = false;
            aiSubmitBtn.disabled = false;
            aiUserInput.focus();
            scrollToBottom();
        });
    });
}