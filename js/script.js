/* ======================================================
   LAM'S PORTFOLIO: CORE ARCHITECTURE & AI INTEGRATION ENGINE
   ====================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  /* --- 1. GLOBAL UI ELEMENTS & STATUS ENGINE --- */
  const statusElement = document.querySelector('.status-message');
  const footerText = document.querySelector('.footer-text');
  const lastUpdated = document.querySelector('.last-updated-date');

  /* --- 2. TYPING EFFECT (The "Living" Persona) --- */
  if (statusElement) {
    const phrases = [
      "Web Developer", 
      "Designing Intelligent Web Experiences with Precision",
      "AI-Driven Solutions", 
      "Human-Led. AI-Enhanced. Web Excellence.",
      "Code by Lam",
    ];

    let phraseIdx = 0, charIdx = 0, isDeleting = false, speed = 100;

    const typeEffect = () => {
      const current = phrases[phraseIdx];
      statusElement.textContent = isDeleting 
        ? current.substring(0, charIdx - 1) 
        : current.substring(0, charIdx + 1);
      
      charIdx = isDeleting ? charIdx - 1 : charIdx + 1;
      speed = isDeleting ? 50 : 100;

      if (!isDeleting && charIdx === current.length) { 
        isDeleting = true; 
        speed = 2000; 
      } else if (isDeleting && charIdx === 0) { 
        isDeleting = false; 
        phraseIdx = (phraseIdx + 1) % phrases.length; 
        speed = 500; 
      }
      setTimeout(typeEffect, speed);
    };
    typeEffect();
  }

  /* --- 3. FOOTER & METADATA --- */
  if (footerText) {
    footerText.innerHTML = `&copy; ${new Date().getFullYear()} Lam Nguyen. All rights reserved.`;
  }
  if (lastUpdated) {
    lastUpdated.textContent = new Date(document.lastModified)
      .toLocaleDateString('en-CA', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
  }

  /* --- 4. 3D INTERACTIVE ENGINE --- */
  const interactiveElements = document.querySelectorAll('.project-card, .ai-chat-window');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      el.style.setProperty('--px', `${(x / rect.width) * 100}%`);
      el.style.setProperty('--py', `${(y / rect.height) * 100}%`);
      el.style.setProperty('--rx', `${(0.5 - (y / rect.height)) * 4}deg`);
      el.style.setProperty('--ry', `${((x / rect.width) - 0.5) * 4}deg`);
    });

    el.addEventListener('mouseleave', () => {
      el.style.setProperty('--px', '50%');
      el.style.setProperty('--py', '50%');
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    });
  });

  /* --- 5. FORMSPREE PIPELINE --- */
  const contactForm = document.querySelector('#contact-form');
  const formStatus = document.querySelector('#form-status');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      formStatus.textContent = 'Transmitting...';
      try {
        const response = await fetch(contactForm.getAttribute('action'), {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          contactForm.reset();
          formStatus.textContent = 'Message transmitted. Happy coding.';
          formStatus.style.color = '#f702c6';
        } else { throw new Error(); }
      } catch (err) {
        formStatus.textContent = 'Transmission failure.';
        formStatus.style.color = '#f00';
      }
    });
  }

  /* --- 6. AI INTEGRATION ENGINE (Sam) --- */
  const CHAT_ENDPOINT = '/api/chat'; 
  const aiToggle = document.querySelector('#ai-toggle-btn');
  const aiClose = document.querySelector('#ai-close-btn');
  const aiWindow = document.querySelector('#ai-chat-window');
  const aiForm = document.querySelector('#ai-chat-form');
  const aiInput = document.querySelector('#ai-user-input');
  const aiMessages = document.querySelector('#ai-chat-messages');
  const aiSubmit = document.querySelector('.ai-submit-btn');

  const scrollToBottom = () => { 
    if (aiMessages) aiMessages.scrollTop = aiMessages.scrollHeight; 
  };

  if (aiToggle && aiWindow) {
    aiToggle.addEventListener('click', () => {
      aiWindow.classList.add('active');
      aiToggle.setAttribute('aria-expanded', 'true');
      aiWindow.setAttribute('aria-hidden', 'false');
      if (aiInput) aiInput.focus();
    });
  }

  if (aiClose && aiWindow) {
    aiClose.addEventListener('click', () => {
      aiWindow.classList.remove('active');
      aiToggle.setAttribute('aria-expanded', 'false');
      aiWindow.setAttribute('aria-hidden', 'true');
    });
  }

  if (aiForm) {
    aiForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const message = aiInput.value.trim();
      if (message === '') return;

      const userMsg = document.createElement('div');
      userMsg.classList.add('msg', 'user-msg'); 
      userMsg.textContent = message;
      aiMessages.appendChild(userMsg);

      aiInput.value = '';
      aiInput.disabled = true;
      aiSubmit.disabled = true;
      scrollToBottom();

      const thinkingDiv = document.createElement('div');
      thinkingDiv.classList.add('msg', 'ai-msg'); 
      thinkingDiv.textContent = "...";
      aiMessages.appendChild(thinkingDiv);
      scrollToBottom();

      const systemContext = `You are Sam, Lam's AI assistant. 
        Focus on his verified stack: HTML, CSS, JS, Figma, WordPress, GitHub & VS Code. 
        Be professional, honest, and growth-oriented. No exaggeration.
        Speak as a technical peer. Be concise. Use short line breaks.
        Focus on "Modern Web Standards" and clean code. You can discuss his 98% academic record 
        or application readiness.  Conventional naming(camelCase) and color formatting(e.g., #666) 
        is developer handoff ready.
        Animations are mature UI with cubic-bezier timing.  Direct inquiries to Lam's GitHub (https://github.com/jmdb9mk67v-beep) and Contact Form.
        `;

      const payload = { 
        prompt: `${systemContext}\nUser Query: ${message}` 
      };

      fetch(CHAT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload) 
      })
      .then(res => res.json()) 
      .then(data => {
        let text = "System Error: Bridge disconnected.";
        if (data.candidates && data.candidates[0]) {
          text = data.candidates[0].content.parts[0].text;
        }
        
        thinkingDiv.innerHTML = text
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\n/g, '<br>'); 
      })
      .catch(() => thinkingDiv.textContent = "Network unreachable.")
      .finally(() => {
        aiInput.disabled = false;
        aiSubmit.disabled = false;
        aiInput.focus();
        scrollToBottom();
      });
    });
  }
});