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
  // ==========================================
// PORTFOLIO AI INTEGRATION 
// ==========================================

// 1. ABSOLUTE ENDPOINT
// We point directly to the working production function used by your other apps
const CHAT_ENDPOINT = 'https://reliable-dragon-75ea77.netlify.app/.netlify/functions/fetchAI'; 

// 2. DOM SELECTORS (Mapped to your specific HTML IDs)
const aiToggleBtn = document.querySelector('#ai-toggle-btn');
const aiCloseBtn = document.querySelector('#ai-close-btn');
const aiChatWindow = document.querySelector('#ai-chat-window');
const aiChatForm = document.querySelector('#ai-chat-form');
const aiUserInput = document.querySelector('#ai-user-input');
const aiChatMessages = document.querySelector('#ai-chat-messages');
const aiSubmitBtn = document.querySelector('.ai-submit-btn');

function scrollToBottom() {
    if (aiChatMessages) {
        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    }
}

// 3. UI TOGGLE LOGIC
if (aiToggleBtn && aiChatWindow) {
    aiToggleBtn.addEventListener('click', () => {
        aiChatWindow.classList.add('show-chat');
        aiToggleBtn.setAttribute('aria-expanded', 'true');
        aiChatWindow.setAttribute('aria-hidden', 'false');
        if (aiUserInput) aiUserInput.focus();
    });
}

if (aiCloseBtn && aiChatWindow) {
    aiCloseBtn.addEventListener('click', () => {
        aiChatWindow.classList.remove('show-chat');
        aiToggleBtn.setAttribute('aria-expanded', 'false');
        aiChatWindow.setAttribute('aria-hidden', 'true');
    });
}

// 4. CHAT LOGIC
if (aiChatForm) {
    aiChatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const message = aiUserInput.value.trim();
        if (message === '') return;

        // Render User Message
        const userMsgDiv = document.createElement('div');
        userMsgDiv.classList.add('msg', 'user-msg'); 
        userMsgDiv.textContent = message;
        aiChatMessages.appendChild(userMsgDiv);

        // UI Reset
        aiUserInput.value = '';
        aiUserInput.disabled = true;
        aiSubmitBtn.disabled = true;
        scrollToBottom();

        // Render AI Loading State
        const thinkingDiv = document.createElement('div');
        thinkingDiv.classList.add('msg', 'ai-msg'); 
        thinkingDiv.textContent = "...";
        aiChatMessages.appendChild(thinkingDiv);
        scrollToBottom();

        // 5. THE PERSONA (Injecting the Portfolio context here)
        const systemContext = `
            You are Sam, Lam Nguyen's digital assistant. 
            Lam is a Web Developer with a 98% academic average. 
            Keep your answers highly professional, detailed, concise, and positive. 
            Question the user's logic occasionally if appropriate.
        `;
        
        // We use "prompt" as the key to match what fetchAI.js expects!
        const payload = { 
            prompt: systemContext + "\nUser Query: " + message 
        };

        fetch(CHAT_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload) 
        })
        .then(response => response.json()) 
        .then(data => {
            let aiResponseText = "System Error: No response generated.";
            
            // Parsing the raw Google response structure
            if (data.candidates && data.candidates.length > 0) {
                aiResponseText = data.candidates[0].content.parts[0].text;
            } else if (data.error) {
                aiResponseText = "Connection Error: " + data.error.message;
            }
            
            // Format Bold and Linebreaks
            thinkingDiv.innerHTML = aiResponseText
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                .replace(/\n/g, '<br>'); 
        })
        .catch(error => {
            console.error("Fetch Error:", error);
            thinkingDiv.textContent = "Network unreachable.";
        })
        .finally(() => {
            aiUserInput.disabled = false;
            aiSubmitBtn.disabled = false;
            aiUserInput.focus();
            scrollToBottom();
        });
    });
  }
  }); // Closes the fetch routine
