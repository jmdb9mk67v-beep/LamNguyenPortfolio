const interactiveCard = document.querySelector('.interactiveCard');
const enterGalleryBtn = document.querySelector('#enterGalleryBtn');
// variableDeclarations

interactiveCard.addEventListener('mousemove', (event) => {
  requestAnimationFrame(() => {
    const rect = interactiveCard.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const percentX = (event.clientX - centerX) / (rect.width / 2);
    const percentY = (event.clientY - centerY) / (rect.height / 2);
    
    const rotateX = percentY * -4;
    const rotateY = percentX * 4;
    
    interactiveCard.style.transform = `
      translateY(-4px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
    `;
  });
});
// interactiveCardMouseMove

interactiveCard.addEventListener('mouseleave', () => {
  requestAnimationFrame(() => {
    interactiveCard.style.transform = `
      translateY(0)
      rotateX(0deg)
      rotateY(0deg)
    `;
  });
});
// interactiveCardMouseLeave

enterGalleryBtn.addEventListener('click', () => {
  window.location.href = 'portfolio.html';
});
// enterGalleryRouting

/* Glowing Eyes and Button Pulse logic */
const glowEyesLayer = document.querySelector('#glowEyesLayer');

enterGalleryBtn.addEventListener('mouseenter', () => {
  requestAnimationFrame(() => {
    glowEyesLayer.classList.add('isGlowing');
  });
});

enterGalleryBtn.addEventListener('mouseleave', () => {
  requestAnimationFrame(() => {
    glowEyesLayer.classList.remove('isGlowing');
  });
});
// hoverIntensityToggle