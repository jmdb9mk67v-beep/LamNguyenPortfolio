document.addEventListener('DOMContentLoaded', () => {
  
  const element = document.querySelector('.status-message');
  const phrases = [
    "Front-End Developer",
    "UI/UX Enthusiast", 
    "AI Integration",
    "Code by Lam",
    "Coming soon to your area...!"
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

  const footerTextElement = document.querySelector('.footer-text');
  const lastUpdatedElement = document.querySelector('.last-updated-date');
  const currentYear = new Date().getFullYear();

  if (footerTextElement) {
      footerTextElement.innerHTML = `&copy; ${currentYear} Lam Nguyen. All rights reserved.`;
  }

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