/* =========================================
   MAGIC PANTRY LOGIC
   "Expansion Pack" - Independent File
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. THE 3D INTERACTION ---
    const cabinet = document.querySelector('#pantryCabinet');
    const doors = document.querySelectorAll('.pantryDoor');
    const hintText = document.querySelector('.pantryHint');

    if (cabinet) {
        doors.forEach(door => {
            door.addEventListener('click', () => {
                cabinet.classList.toggle('isOpen');
                
                if (cabinet.classList.contains('isOpen')) {
                    hintText.textContent = "Search for recipes below...";
                    hintText.style.animation = "none";
                } else {
                    hintText.textContent = "Tap the doors to open your pantry";
                }
            });
        });
    }

    // --- 2. THE SPOONACULAR SEARCH ---
    const searchBtn = document.querySelector('#pantrySearchBtn');
    const inputField = document.querySelector('#pantryInput');
    const resultsArea = document.querySelector('#pantryResults');

    // API Key
    const apiKey = "49475f8a09db4d6caf39f8dd350812ce"; 
    
    // --- MODAL ELEMENTS ---
    const modalWindow = document.querySelector("#recipeModal");
    const closeBtn = document.querySelector(".closeBtn");
    const STORAGE_KEY = "mintAndMeasureCookbook";

    // --- SEARCH LISTENER ---
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const ingredients = inputField.value.trim();
            if (ingredients.length > 0) {
                searchBtn.textContent = "Searching...";
                fetchRecipesByIngredients(ingredients);
            }
        });
    }

    // --- API: FETCH BASIC LIST ---
    function fetchRecipesByIngredients(ingredients) {
        // ignoringPantry=true means "assume I have basic stuff like flour/water"
        const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=6&ranking=1&ignorePantry=true&apiKey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                displayPantryResults(data);
                searchBtn.textContent = "Find Recipes"; 
            })
            .catch(error => {
                console.error("Error fetching recipes:", error);
                searchBtn.textContent = "Error - Try Again";
            });
    }

    // --- DISPLAY CARDS ---
    function displayPantryResults(recipes) {
        resultsArea.innerHTML = ""; 

        if (recipes.length === 0) {
            resultsArea.innerHTML = "<p>No recipes found. Try different ingredients!</p>";
            return;
        }

        recipes.forEach(recipe => {
            const card = document.createElement('div');
            card.classList.add('mealCard'); 

            const img = document.createElement('img');
            img.src = recipe.image;
            img.alt = recipe.title;

            const title = document.createElement('h3');
            title.textContent = recipe.title;

            // Missing Ingredient Count
            const missingCount = recipe.missedIngredientCount;
            const subtext = document.createElement('p');
            subtext.style.color = "#1f6f5b";
            subtext.style.fontWeight = "bold";
            
            if (missingCount === 0) {
                subtext.textContent = "✨ You have everything!";
            } else {
                subtext.textContent = `Missing ${missingCount} ingredient(s)`;
            }

            const actionsDiv = document.createElement('div');
            actionsDiv.classList.add('cardActions');

            // "See Recipe" Button
            const viewBtn = document.createElement('button');
            viewBtn.classList.add('viewRecipeBtn');
            viewBtn.textContent = "See Recipe";
            
            // CLICK EVENT: Calls the detail fetcher
            viewBtn.addEventListener('click', () => {
                getSpoonacularDetails(recipe.id);
            });
            
            card.appendChild(img);
            card.appendChild(title);
            card.appendChild(subtext);
            card.appendChild(actionsDiv);
            card.appendChild(viewBtn);

            resultsArea.appendChild(card);
        });
    }

    // --- API: FETCH FULL DETAILS (Fixing the issue) ---
    function getSpoonacularDetails(id) {
        const url = `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false&apiKey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                openPantryModal(data);
            })
            .catch(error => console.error("Error fetching details:", error));
    }

    // --- UI: OPEN MODAL ---
    function openPantryModal(recipe) {
        if (!modalWindow) {
            console.error("Recipe Modal HTML is missing from the page!");
            return;
        }

        const title = document.querySelector("#modalTitle");
        const image = document.querySelector("#modalImage");
        const instructions = document.querySelector("#modalInstructions");
        const ingredientsList = document.querySelector("#modalIngredients");
        const modalSaveBtn = document.querySelector("#modalSaveBtn");
        const modalShareBtn = document.querySelector("#modalShareBtn");

        // 1. Fill Text
        title.innerText = recipe.title;
        image.src = recipe.image;
        
        // Instructions (Spoonacular vs MealDB difference handling)
        if (recipe.instructions) {
             instructions.innerHTML = recipe.instructions;
        } else if (recipe.summary) {
             instructions.innerHTML = recipe.summary;
        } else {
             instructions.textContent = "No instructions provided.";
        }

        // 2. Fill Ingredients
        ingredientsList.innerHTML = "";
        if (recipe.extendedIngredients) {
            recipe.extendedIngredients.forEach(ing => {
                const li = document.createElement("li");
                li.textContent = `${ing.amount} ${ing.unit} ${ing.name}`;
                ingredientsList.appendChild(li);
            });
        }
        
        // --- 3. Cookbook Save Logic ---
        const formattedMeal = {
            idMeal: recipe.id.toString(), 
            strMeal: recipe.title, 
            strMealThumb: recipe.image,
            source: 'spoonacular'  // <--- THIS IS THE NEW "TAG"
        };

        const savedList = getSavedRecipes();
        const isSaved = savedList.some(item => item.idMeal === formattedMeal.idMeal);

        if (isSaved) {
            modalSaveBtn.innerHTML = "&#10084; Saved";
            modalSaveBtn.classList.add("saveBtnActive");
        } else {
            modalSaveBtn.innerHTML = "&#9825; Add to Cookbook";
            modalSaveBtn.classList.remove("saveBtnActive");
        }

        modalSaveBtn.onclick = function () {
            const currentList = getSavedRecipes();
            const alreadySaved = currentList.some(item => item.idMeal === formattedMeal.idMeal);

            if (alreadySaved) {
                removeFromCookbook(formattedMeal.idMeal);
                modalSaveBtn.innerHTML = "&#9825; Add to Cookbook";
                modalSaveBtn.classList.remove("saveBtnActive");
            } else {
                saveToCookbook(formattedMeal);
                modalSaveBtn.innerHTML = "&#10084; Saved";
                modalSaveBtn.classList.add("saveBtnActive");
            }
        };
        
        // 4. Share Logic
        if(modalShareBtn) {
            modalShareBtn.onclick = function() {
                navigator.clipboard.writeText("Check out " + recipe.title);
                alert("Link Copied!");
            }
        }

        // 5. Show the box
        modalWindow.style.display = "block";
    }

    // --- CLOSE MODAL LOGIC ---
    // (Crucial for an independent file!)
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modalWindow.style.display = "none";
        });
    }
    
    if (modalWindow) {
        window.addEventListener("click", (event) => {
            if (event.target === modalWindow) {
                modalWindow.style.display = "none";
            }
        });
    }

    // --- HELPER FUNCTIONS ---
    function getSavedRecipes() {
        const storedData = localStorage.getItem(STORAGE_KEY);
        return storedData ? JSON.parse(storedData) : [];
    }

    function saveToCookbook(meal) {
        let list = getSavedRecipes();
        list.push(meal);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }

    function removeFromCookbook(id) {
        let list = getSavedRecipes();
        const updatedList = list.filter(item => item.idMeal !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    }

});