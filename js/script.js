const statusMessage = document.querySelector('.status-message');

const messages = [
  'Building something great...',
  'Polishing the pixels...',
  'Compiling code...',
  'Launching soon...',
  'In your area...!',
  'Code by LAM...',
];

let currentIndex = 0;

function cycleMessages() {
  statusMessage.classList.add('hidden');

  setTimeout(() => {
    currentIndex = (currentIndex + 1) % messages.length;
    statusMessage.textContent = messages[currentIndex];
    statusMessage.classList.remove('hidden');
  }, 500);
}

setInterval(cycleMessages, 3000);

// ===========> Footer and copyright year, auto update. <=============== //

const footerTextElement = document.querySelector('.footer-text');
const lastUpdatedElement = document.querySelector('.last-updated-date');
const currentYear = new Date().getFullYear();

// Update the copyright year
if (footerTextElement) {
    footerTextElement.innerHTML = `&copy; ${currentYear} Lam Nguyen. All rights reserved.`;
}

// Get the last modified date of the file
const lastModifiedDate = new Date(document.lastModified);
const formattedDate = lastModifiedDate.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

// Update the "Last Updated" span
if (lastUpdatedElement) {
    lastUpdatedElement.textContent = formattedDate;
}