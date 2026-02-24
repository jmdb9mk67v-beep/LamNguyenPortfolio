document.addEventListener('DOMContentLoaded', () => {
  
  const element = document.querySelector('.status-message');
  
  if (element) {
    const phrases = [
      "Front-End Web Developer",
      "UI/UX Designer", 
      "AI Integration",
      "Code by Lam",
      "Building Digital Experiences"
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