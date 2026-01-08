// --- The ChefConverter Class Feature ---

// This class encapsulates all the logic, state, and event handling for the unit converter widget.
class ChefConverter {
    
    // The constructor method is executed when a new instance of the class is created.
    constructor() {
        // 1. Class Properties: Store references to DOM elements using querySelector.
        this.amountInput = document.querySelector('#amountInput');
        this.resultOutput = document.querySelector('#resultOutput');
        this.fromContainer = document.querySelector('#unitFromContainer');
        this.toContainer = document.querySelector('#unitToContainer');
        
        // 2. Conversion Factors: Defined as a property, accessible throughout the class.
        // Base unit for calculation is Grams (1g = 1).
        this.conversionFactors = {
            // Volume-to-Weight (approximated to water density: 1mL ≈ 1g)
            'cup': 236.59,      // 1 cup = 236.59 g
            'milliliter': 1,    // 1 mL = 1 g
            'liter': 1000,      // 1 L = 1000 g

            // Weight Units (to Grams)
            'gram': 1,          // 1 g = 1 g (Base unit)
            'ounce': 28.35,     // 1 oz = 28.35 g
            'pound': 453.59     // 1 lb = 453.59 g
        };

        // 3. Initialization: Set up listeners and run the initial calculation.
        this.setUpEventListeners();
        // The initial calculation is now run at the end of the constructor.
        this.calculateConversion();
    }
    
    // Method to attach all necessary event listeners to the page elements.
    setUpEventListeners() {
        // Use 'bind(this)' to correctly maintain the class context inside the handler functions.
        this.fromContainer.addEventListener('click', this.handleUnitSelection.bind(this));
        this.toContainer.addEventListener('click', this.handleUnitSelection.bind(this));
        
        // Attaching the calculation directly to the input event for dynamic updates.
        this.amountInput.addEventListener('input', this.calculateConversion.bind(this));
    }

    // Method to handle the selection of a unit button and update its 'active' state.
    handleUnitSelection(event) {
        // Ensure only clicks on the actual unit buttons proceed.
        if (event.target.classList.contains('unitButton')) {
            const parentContainer = event.target.closest('.buttonContainer');
            
            // Remove 'active' class from all buttons in the group.
            const siblingButtons = parentContainer.querySelectorAll('.unitButton');
            siblingButtons.forEach(button => {
                button.classList.remove('active');
            });

            // Add 'active' class to the newly clicked button.
            event.target.classList.add('active');
            
            // Recalculate the result based on the new selection.
            this.calculateConversion();
        }
    }
    
    // Core method that performs the calculation using the selected units. (FULL LOGIC INSERTED)
    calculateConversion() {
        // Get the current input amount and selected units from the active buttons.
        const fromUnitButton = document.querySelector('#unitFromContainer .unitButton.active');
        const toUnitButton = document.querySelector('#unitToContainer .unitButton.active');
        
        // Safety check to ensure units are selected.
        if (!fromUnitButton || !toUnitButton) return;

        const fromUnit = fromUnitButton.getAttribute('data-unit');
        const toUnit = toUnitButton.getAttribute('data-unit');
        let amount = parseFloat(this.amountInput.value);

        // Error checking for invalid or non-positive input.
        if (isNaN(amount) || amount <= 0) {
            this.resultOutput.textContent = 'Please enter a valid amount.';
            return;
        }
        
        // Get conversion factors from the class property (this.conversionFactors).
        let fromFactor = this.conversionFactors[fromUnit];
        let toFactor = this.conversionFactors[toUnit];
        
        if (fromFactor === undefined || toFactor === undefined) return;
        
        // Step 1: Convert the input amount TO the base unit (Grams).
        let amountInBaseUnit = amount * fromFactor;
        
        // Step 2: Convert the base unit amount TO the final output unit.
        let finalAmount = amountInBaseUnit / toFactor;
        
        // Format the result to two decimal places.
        let formattedResult = finalAmount.toFixed(2);
        
        // Determine the correct unit abbreviation for display.
        let displayUnit = toUnit;
        if (toUnit === 'milliliter') displayUnit = 'mL';
        if (toUnit === 'liter') displayUnit = 'L';
        if (toUnit === 'gram') displayUnit = 'g';
        if (toUnit === 'ounce') displayUnit = 'oz';
        if (toUnit === 'pound') displayUnit = 'lb';

        // Update the result span.
        this.resultOutput.textContent = formattedResult + ' ' + displayUnit.toUpperCase();
    }
}

// Instantiate the class to start the functionality when the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', () => {
    // FIX 1: Using a camelCase variable name (chefConverter) to create the instance.
    const chefConverter = new ChefConverter();
});

const converterDiv = document.querySelector(".converterDiv");
const instructionsDiv = document.querySelector(".instructionsDiv");
const allSteps = document.querySelectorAll(".stepText");