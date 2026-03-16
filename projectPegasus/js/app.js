/**
 * Project Pegasus | Core Logic
 * Handles 3D interaction physics and telemetry simulation.
 * Strict separation of concerns(no inline styling): Logic only.
 */


const metricCards = document.querySelectorAll('.metricCard');

// * Initilization: Setup Listeners and start the data stream

const initApp = () => {
  setupInteraction();
  startTelemetry();
};

// Interaction Engine: High-performance 3D tilt logic
// Uses will-change: transform to bypass layout thrashing

const setupInteraction = () => {
  metricCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();

      // Calculate cursor position relative to card center
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height /2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      //  Map positions to rotation (Max 4deg as per spec)
      const rotateX = (mouseY / (rect.height / 2)) * -4;
      const rotateY = (mouseX / (rect.width / 2)) * 4;

      // Apply transform using hardware-accelerated properties
     card.style.transform = `
        perspective(1000px) 
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg) 
        translateY(-4px)
      `;
    });

    // Reset card state on mouse leave
    card.addEventListener('mouseleave', () => {
      card.style.transform = `
      perspective(1000px)
      rotateX(0deg)
      rotateY(0deg)
      translateY(0px)
      `;
    });
  });
};

// Telemetry Simulator: Mock data ingestion.  Simulates a real-time stream for presentation.

const startTelemetry = () => {
  setInterval(() => {
    // Latency simulation (random ms between 10-50)
    const latencyValue = Math.floor(Math.random() * 40) + 10;
    updateMetric('networkLatency', latencyValue);

    // Radius simulation (random km with decimals)
    const radiusValue = (Math.random() * 5 + 12.5).toFixed(2);
    updateMetric('geoDistance', radiusValue);
  }, 1500);
};

// DOM Updater: Optimized to prevent reflows.

const updateMetric = (id, value) => {
  const element = document.querySelector(`#${id} .metricValue`);
  if (element) {
    element.textContent = value;
  }
};

// Fire the engine
initApp();


