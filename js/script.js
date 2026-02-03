document.addEventListener('DOMContentLoaded', () => {
  
  const element = document.querySelector('.status-message');
  
  // Updated phrases to reflect your current triOS student status
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
      typeSpeed = 2000; // Pause at end of phrase
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 500; // Pause before typing next
    }

    setTimeout(typeEffect, typeSpeed);
  }

  typeEffect();

  // Footer Date Logic
  const footerTextElement = document.querySelector('.footer-text');
  const lastUpdatedElement = document.querySelector('.last-updated-date');
  const currentYear = new Date().getFullYear();

  if (footerTextElement) {
      footerTextElement.innerHTML = `&copy; ${currentYear} Lam Nguyen. All rights reserved.`;
  }

  // Last Updated Logic
  const lastModifiedDate = new Date(document.lastModified);
  const formattedDate = lastModifiedDate.toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
  });

  if (lastUpdatedElement) {
      lastUpdatedElement.textContent = formattedDate;
  }
});

// Interactive background <========== //
document.addEventListener('mousemove', (e) => {
  const moveX = (e.clientX / window.innerWidth) * 20;
  const moveY = (e.clientY / window.innerHeight) * 20;
  document.body.style.backgroundPosition = `0% 0%, ${moveX}px ${moveY}px, ${moveX}px ${moveY}px`;
});

document.addEventListener('mousemove', (e) => {
  // We calculate a small offset (dividing by 50 keeps it subtle)
  const x = e.clientX / 50;
  const y = e.clientY / 50;
  
  document.body.style.setProperty('--mouse-offset-x', `${x}px`);
  document.body.style.setProperty('--mouse-offset-y', `${y}px`);
});