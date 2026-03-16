# Project-Pegasus
A Real-Time Telemetry &amp; Performance Dashboard


A high-fidelity telemetry interface engineered for real-time data visualization and hardware-accelerated interaction. Developed as a technical showcase for Application & Web Development internship interviews.

## Technical Highlights
* **Interaction Physics:** Custom JS-driven 3D tilt mechanics using coordinate vector mapping (Max 4deg tilt / -4px translate).
* **Rendering Optimization:** Utilizes `will-change: transform` and `requestAnimationFrame` principles to ensure 60fps performance with zero layout thrashing.
* **Fluid UI Architecture:** Modern responsive construction using CSS Grid, Flexbox, and `clamp()` for dynamic scaling.
* **Data Integrity:** Implements `font-variant-numeric: tabular-nums` to ensure visual stability during high-frequency data updates.

## Performance Specs
* **Theme:** High-contrast matte (#0a0a0a)
* **Units:** Strictly Metric (km/ms)
* **Logic:** Decoupled simulation engine for predictable demonstration stability.
