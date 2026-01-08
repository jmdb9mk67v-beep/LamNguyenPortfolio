/* =========================================
   THE MINT SCALER CLASS
   ========================================= */

class MintScaler {
  constructor() {
    // 1. Select DOM Elements using querySelector
    this.amountToScaleInput = document.querySelector('#amountToScale');
    this.scaledResultOutput = document.querySelector('#scaledResult');

    // Groups
    this.modeBtns = document.querySelectorAll('.modeBtn');
    this.uiSections = document.querySelectorAll('.scalerUi');
    this.multBtns = document.querySelectorAll('.multBtn');

    // Specific Inputs
    this.origYieldInput = document.querySelector('#origYield');
    this.targetYieldInput = document.querySelector('#targetYield');
    this.recipeHasInput = document.querySelector('#recipeHas');
    this.userHasInput = document.querySelector('#userHas');

    // 2. State
    this.currentMode = 'yield';
    this.multiplierValue = 1;

    // 3. Initialize
    // Only run if the elements exist on this page
    if (this.amountToScaleInput && this.scaledResultOutput) {
      this.init();
    }
  }

  init() {
    // A. Main Input Listener
    this.amountToScaleInput.addEventListener('input', () => this.calculateScale());

    // B. Mode Tabs Listener
    this.modeBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => this.handleModeSwitch(e));
    });

    // C. Multiplier Buttons Listener
    this.multBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => this.handleMultiplierClick(e));
    });

    // D. Sub-Input Listeners
    const subInputs = [
      this.origYieldInput,
      this.targetYieldInput,
      this.recipeHasInput,
      this.userHasInput,
    ];

    subInputs.forEach((input) => {
      if (input) {
        input.addEventListener('input', () => this.calculateScale());
      }
    });
    
    // Run initial calculation (in case there is a default value)
    this.calculateScale();
  }

  handleModeSwitch(event) {
    // 1. Update Tabs Visuals
    this.modeBtns.forEach((btn) => btn.classList.remove('active'));
    
    // Use currentTarget to ensure we get the button, even if user clicks a nested element
    const clickedBtn = event.currentTarget;
    clickedBtn.classList.add('active');

    // 2. Get new mode
    this.currentMode = clickedBtn.getAttribute('data-mode');

    // 3. Update UI Sections
    this.uiSections.forEach((section) => {
      section.classList.remove('scalerUiActive');
      // Force hide to ensure switching works visually
      section.style.display = 'none';

      // Check if this section matches the current mode (e.g. "yield" + "Ui")
      if (section.id === this.currentMode + 'Ui') {
        section.classList.add('scalerUiActive');
        section.style.display = 'block';
      }
    });

    // 4. Recalculate
    this.calculateScale();
  }

  handleMultiplierClick(event) {
    // 1. Update Buttons Visuals
    this.multBtns.forEach((btn) => btn.classList.remove('active'));
    
    const clickedBtn = event.currentTarget;
    clickedBtn.classList.add('active');

    // 2. Update Value
    const valString = clickedBtn.getAttribute('data-val');
    this.multiplierValue = parseFloat(valString);

    // 3. Recalculate
    this.calculateScale();
  }

  calculateScale() {
    // Get the main input
    const rawAmount = this.amountToScaleInput.value;
    const amount = parseFloat(rawAmount);

    // Validation: If empty or not a number, show dashes
    if (isNaN(amount) || rawAmount === '') {
      this.scaledResultOutput.innerText = '---';
      return;
    }

    let factor = 1;

    // --- LOGIC PER MODE ---

    if (this.currentMode === 'yield') {
      const oldYield = parseFloat(this.origYieldInput.value);
      const newYield = parseFloat(this.targetYieldInput.value);

      // Avoid dividing by zero
      if (oldYield > 0 && newYield > 0) {
        factor = newYield / oldYield;
      }
    } 
    else if (this.currentMode === 'multiplier') {
      factor = this.multiplierValue;
    } 
    else if (this.currentMode === 'ingredient') {
      const rHas = parseFloat(this.recipeHasInput.value);
      const uHas = parseFloat(this.userHasInput.value);

      if (rHas > 0 && uHas > 0) {
        factor = uHas / rHas;
      }
    }

    // --- FINAL CALCULATION ---
    const finalResult = amount * factor;

    // Round to 2 decimals, but remove trailing zeros (e.g. 5.00 -> 5)
    this.scaledResultOutput.innerText = parseFloat(finalResult.toFixed(2));
  }
}

// Start the class when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const mintScaler = new MintScaler();
});

// click to pause video in case it gets annoying
const videoBox = document.querySelector('.scalerVideoContainer');
const videoFile = document.querySelector('.scalerVideo');

videoBox.addEventListener('click', () => {
  if (videoFile.paused) {
    videoFile.play();
  } else {
    videoFile.pause();
  }
});