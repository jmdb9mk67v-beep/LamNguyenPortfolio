// ==========================================
// HEARTLAND HARMONY - TAB SWITCHING LOGIC
// ==========================================

// 1. SELECT THE DOM ELEMENTS
// We use querySelectorAll to grab all elements that share these classes.
// This creates a NodeList (similar to an array) that we can loop through.
const tabBtns = document.querySelectorAll('.tabBtn');
const tabContents = document.querySelectorAll('.tabContent');

// 2. LISTEN FOR USER INTERACTION
// We loop through our NodeList of buttons using forEach.
// For every individual button ('btn'), we attach an event listener.
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    
    // 3. IDENTIFY THE TARGET
    // When a button is clicked, we read its 'data-target' attribute.
    // This tells us exactly which iframe container needs to be shown.
    const targetId = btn.dataset.target;

    // 4. RESET THE STATE (CLEANUP)
    // Before showing the new content, we must hide everything else.
    // We loop through all buttons and remove the 'active' class...
    tabBtns.forEach(b => b.classList.remove('active'));
    // ...and we loop through all content divs to remove their 'active' class.
    tabContents.forEach(c => c.classList.remove('active'));

    // 5. ACTIVATE THE CLICKED BUTTON
    // We add the 'active' class to the specific button the user just clicked.
    // This triggers our CSS to turn the button background black.
    btn.classList.add('active');

    // 6. REVEAL THE TARGET CONTENT
    // We use querySelector to find the specific content div by its ID.
    // We use the template literal `#${targetId}` to dynamically match the ID.
    const activeContent = document.querySelector(`#${targetId}`);
    
    // 7. SAFETY CHECK & EXECUTE
    // We check if the target content actually exists in the DOM to prevent errors.
    // If it exists, we add the 'active' class, which triggers our CSS opacity transition.
    if (activeContent) {
      activeContent.classList.add('active');
    }
  });
});

// Logic finished. Safe from layout thrashing as we only animate opacity.