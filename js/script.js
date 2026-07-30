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
      "Application Developer",
      "Human-Led. AI-Enhanced. Web Excellence.",
      "Code by Lam"
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

  /* --- 4. HIGH-PERFORMANCE INTERACTIVE ENGINE --- */
  const projectsGrid = document.querySelector('.projects-grid');
  const aiChatWindow = document.querySelector('#ai-chat-window');
  const loadingSentinel = document.querySelector('#loadingSentinel');

  /* Optimized 3D cursor tracking engine utilizing event 
     delegation on the parent projects container. */
  if (projectsGrid) {
    projectsGrid.addEventListener('mousemove', (e) => {
      const card = e.target.closest('.project-card');
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--px', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--py', `${(y / rect.height) * 100}%`);
      card.style.setProperty('--rx', `${(0.5 - (y / rect.height)) * 4}deg`);
      card.style.setProperty('--ry', `${((x / rect.width) - 0.5) * 4}deg`);
    });

    projectsGrid.addEventListener('mouseleave', (e) => {
      const card = e.target.closest('.project-card');
      if (!card) return;

      card.style.setProperty('--px', '50%');
      card.style.setProperty('--py', '50%');
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    }, true);
  }

  /* Static element cursor tracking context for the AI Chat widget */
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

  /* --- 5. INFINITE SCROLL GENERATOR PIPELINE --- */
  let isFetching = false;
  let hasMoreData = true;
  let currentPage = 1;

  async function fetchNextProjects() {
    isFetching = true;
    console.log(`Pipeline Active: Fetching page ${currentPage}...`);

    const mockDatabase = {
      page1: [
        
      ],
      page2: [
        
      ]
    };

    // Simulate an async asset loading latency threshold
    await new Promise(resolve => setTimeout(resolve, 800));
    const currentBatch = mockDatabase[`page${currentPage}`];

    if (currentBatch && currentBatch.length > 0) {
      const fragment = document.createDocumentFragment();

      currentBatch.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card dynamic-entry';
        
        card.innerHTML = `
          <h3>${project.title}</h3>
          <p>${project.desc}</p>
          <a href="${project.link}" 
             target="_blank"
             rel="noopener noreferrer" 
             class="btn-visit">View Project</a>
        `;
        fragment.appendChild(card);
      });

      projectsGrid.appendChild(fragment);
      currentPage++;
    }

    // Terminate lifecycle gracefully if the data pool ends
    if (!mockDatabase[`page${currentPage}`]) {
      hasMoreData = false;
      console.log("All projects loaded. Powering down gallery observer.");
      galleryObserver.disconnect();
      if (loadingSentinel) loadingSentinel.style.display = 'none';
    }

    isFetching = false;
  }

  const triggerNextBatch = (entries) => {
    const [entry] = entries;
    if (entry.isIntersecting && !isFetching && hasMoreData) {
      fetchNextProjects();
    }
  };

  const galleryObserver = new IntersectionObserver(triggerNextBatch, {
    root: null,
    rootMargin: '200px',
    threshold: 0
  });

  if (loadingSentinel) {
    galleryObserver.observe(loadingSentinel);
  }

  /* --- 6. SCROLL-DRIVEN ENTRY REVEAL ENGINE --- */
  /* Centralized, optimized Intersection Observer managing the spatial entry 
     animations for the primary document container blocks. */
  const initGlobalScrollReveal = () => {
    const revealTargets = document.querySelectorAll('.scrollReveal');
    if (revealTargets.length === 0) return;

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealActive');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.15
    });

    revealTargets.forEach(target => revealObserver.observe(target));
  };
  initGlobalScrollReveal();

  /* --- 7. FORMSPREE PIPELINE --- */
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

  /* --- 8. AI INTEGRATION ENGINE (Sam with Memory) --- */
  const chatEndpoint = '/api/chat'; 
  const aiToggle = document.querySelector('#ai-toggle-btn');
  const aiClose = document.querySelector('#ai-close-btn');
  const aiWindow = document.querySelector('#ai-chat-window');
  const aiForm = document.querySelector('#ai-chat-form');
  const aiInput = document.querySelector('#ai-user-input');
  const aiMessages = document.querySelector('#ai-chat-messages');
  const aiSubmit = document.querySelector('.ai-submit-btn');

  let chatHistory = [];

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

      const systemContext = `You are Sam, the friendly and helpful AI Co-Pilot 
                            for Lam Nguyen, Web Developer. 

                            VERIFIED IDENTITY:
                            - Name: Lam Nguyen
                            - Role: Web and Application Developer (triOS College Graduate)
                            - Academic Record: 98% average.

                            OFFICIAL CONTACT LINKS:
                            - GitHub: https://github.com/jmdb9mk67v-beep
                            - LinkedIn: https://www.linkedin.com/in/lam-nguyen-91ba10387/
                            - Portfolio: https://lamnguyen.ca
                            - Email: Use Contact Form 

                            RESPONSE STYLE:
                            - Be concise and professional.
                            - Never guess usernames or URLs. 
                            - Use the verified links provided above ONLY.
                            - If asked about "him," refer to Lam Nguyen.`;

      const payload = { 
        prompt: message,
        history: chatHistory,
        systemInstruction: systemContext
      };

      fetch(chatEndpoint, {
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
        
        chatHistory.push({ role: 'user', content: message });
        chatHistory.push({ role: 'model', content: text });

        if (chatHistory.length > 10) chatHistory = chatHistory.slice(-10);

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

/* --- 9. NAVIGATION LAYOUT COMPONENT --- */
document.addEventListener('DOMContentLoaded', () => {
  const sideNav = document.querySelector('#sideNav');
  const navToggle = document.querySelector('#navToggle');
  const navLinks = document.querySelectorAll('.navLink');

  if (navToggle && sideNav) {
    navToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      sideNav.classList.toggle('navOpen');
      console.log('Mobile menu state toggled');
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      sideNav.classList.remove('navOpen');
    });
  });
});