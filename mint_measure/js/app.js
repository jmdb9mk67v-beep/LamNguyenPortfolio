// ==============> MAIN js for recipe.html / myCookbook < ======== //
// BOTH api keys from themealDB and Spoonacular are in here < ============ //

// ============ > Fade in the pages when loaded <============== //

window.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
});

// ======== Fade out when clicking links ========= //
document.addEventListener('click', e => {
    const link = e.target.closest('a');
    // Ensure it's a link, it's not the hamburger menu, and it's internal
    if (link && link.href && !link.href.includes('#') && !link.onclick) {
        e.preventDefault(); // Stop immediate jump
        document.body.classList.remove('loaded'); // Fade out
        
        // Wait for fade (400ms) then go to link
        setTimeout(() => {
            window.location.href = link.href;
        }, 600); 
    }
});

// --- 1. VARIABLES & SELECTORS ---
// Grab all the buttons and inputs we need from the HTML
const searchButton = document.querySelector("#searchButton");
const cookbookButton = document.querySelector("#cookbookButton");
const browseButton = document.querySelector("#browseButton");
const searchInput = document.querySelector("#searchInput");
const categorySelect = document.querySelector("#categorySelect");
const resultsContainer = document.querySelector(".resultsPreview");
const modalWindow = document.querySelector("#recipeModal");
const closeModalBtn = document.querySelector(".closeBtn");
// Spoonacular API for cookbook to fetch
const spoonApiKey = "49475f8a09db4d6caf39f8dd350812ce"; 

// The key used to save data in the browser's LocalStorage
const STORAGE_KEY = "mintAndMeasureCookbook";

// --- 2. EVENT LISTENERS ---

// Search Button: Triggers when user clicks 'Search'
// --- [FIX] Added check to ensure button exists before adding listener 
// To stop site from crashing, apparently I have too many buttons!

if (searchButton) {
  searchButton.addEventListener("click", function (event) {
    event.preventDefault(); // Stop form from reloading page
    resultsContainer.innerHTML = ""; // Clear previous results
    getMealList(); // Run search
  });
}

// Live Search: Triggers as the user types
// --- [FIX] Added check to ensure input exists
if (searchInput) {
  searchInput.addEventListener("input", function () {
    const text = searchInput.value.trim();
    if (text.length > 0) {
      resultsContainer.innerHTML = "";
      getMealList();
    } else {
      resultsContainer.innerHTML = "";
    }
  });
}

// Category Dropdown: Triggers when user picks a category (e.g., Breakfast)
// --- [FIX] Added check to ensure dropdown exists
if (categorySelect) {
  categorySelect.addEventListener("change", function () {
    if (categorySelect.value !== "") {
      searchInput.value = "";
      resultsContainer.innerHTML = "";
      getMealsByCategory(categorySelect.value);
    }
  });
}

// Cookbook Button: Loads saved recipes
// --- [FIX] Added check to ensure button exists
if (cookbookButton) {
  cookbookButton.addEventListener("click", function (event) {
    event.preventDefault();
    resultsContainer.innerHTML = "";
    showCookbook();
  });
}

// Browse Button: Loads A-Z list
// --- [FIX] Added check to ensure button exists
if (browseButton) {
  browseButton.addEventListener("click", function (event) {
    event.preventDefault();
    browseAlphabet();
  });
}

// Modal Closers: Click 'X' or click outside the box
// --- [FIX] Added check for close button
if (closeModalBtn) {
  closeModalBtn.addEventListener("click", function () {
    modalWindow.style.display = "none";
  });
}
// Window click listener is safe to leave global, but we check if modalWindow exists
if (modalWindow) {
  window.addEventListener("click", function (event) {
    if (event.target === modalWindow) {
      modalWindow.style.display = "none";
    }
  });
}

// --- 3. API FUNCTIONS ---

// Fetch meals based on search text
function getMealList() {
  const searchText = searchInput.value.trim();
  if (searchText.length === 0) return;

  let url;
  // Single letter search vs full word search
  if (searchText.length === 1) {
    url = "https://www.themealdb.com/api/json/v1/1/search.php?f=" + searchText;
  } else {
    url = "https://www.themealdb.com/api/json/v1/1/search.php?s=" + searchText;
  }

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      displayMeals(data.meals, false);
    })
    .catch((error) => console.error(error));
}

// Fetch meals by Category
function getMealsByCategory(category) {
  const url =
    "https://www.themealdb.com/api/json/v1/1/filter.php?c=" + category;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      displayMeals(data.meals, false);
    });
}

// Fetch meals for every letter of the alphabet
function browseAlphabet() {
  resultsContainer.innerHTML = "";
  const alphabet = "abcdefghijklmnopqrstuvwxyz"
    .split("")
    .concat(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);

  alphabet.forEach(function (letter) {
    const url =
      "https://www.themealdb.com/api/json/v1/1/search.php?f=" + letter;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.meals) {
          displayMeals(data.meals, false);
        }
      });
  });
}

// --- 4. COOKBOOK LOGIC ---

function showCookbook() {
  const savedRecipes = getSavedRecipes();
  // --- [FIX] Safety check: Ensure resultsContainer exists before clearing it
  if (resultsContainer) {
    resultsContainer.innerHTML = ""; 
    displayMeals(savedRecipes, true); // true = cookbook mode
  }
}

function getSavedRecipes() {
  const storedData = localStorage.getItem(STORAGE_KEY);
  return storedData ? JSON.parse(storedData) : [];
}

function saveToCookbook(meal) {
  let list = getSavedRecipes();
  list.push({
    idMeal: meal.idMeal,
    strMeal: meal.strMeal,
    strMealThumb: meal.strMealThumb,
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function removeFromCookbook(id) {
  let list = getSavedRecipes();
  const updatedList = list.filter((item) => item.idMeal !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
}

// --- 5. UI GENERATION ---

// Creates the HTML cards for recipes
function displayMeals(meals, isCookbookMode) {
  // --- [FIX] Added safety check for resultsContainer
  if (!resultsContainer) return; 
  if (!meals || meals.length === 0) return;

  const savedList = getSavedRecipes();

  meals.forEach(function (meal) {
    // Create Card Wrapper
    const card = document.createElement("div");
    card.classList.add("mealCard");

    // Image
    const img = document.createElement("img");
    img.src = meal.strMealThumb;
    img.alt = meal.strMeal;

    // Title
    const title = document.createElement("h3");
    title.innerText = meal.strMeal;

    // Action Buttons Wrapper
    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("cardActions");

   // "Get Recipe" Button
    const viewBtn = document.createElement("button");
    viewBtn.classList.add("viewRecipeBtn");
    viewBtn.innerText = "Get Recipe";
    
    // UPDATED: Pass the source (spoonacular or undefined)
    viewBtn.addEventListener("click", function () {
      getRecipeDetails(meal.idMeal, meal.source);
    });

    // Share Button
    const shareBtn = document.createElement("button");
    shareBtn.classList.add("iconBtn");
    shareBtn.innerHTML = "&#128279;";
    shareBtn.addEventListener("click", function () {
      navigator.clipboard.writeText(
        "Check out " + meal.strMeal + " at Mint & Measure!"
      );
      alert("Link copied!");
    });

    // Heart/Remove Button
    const actionBtn = document.createElement("button");

    if (isCookbookMode) {
      // "Remove" style for cookbook
      actionBtn.classList.add("viewRecipeBtn");
      actionBtn.style.backgroundColor = "#c62828";
      actionBtn.innerText = "Remove";
      actionBtn.addEventListener("click", function () {
        removeFromCookbook(meal.idMeal);
        if (resultsContainer) resultsContainer.innerHTML = "";
        showCookbook();
      });
    } else {
      // Heart style for search
      actionBtn.classList.add("iconBtn", "saveBtn");
      actionBtn.innerHTML = "&#10084;";

      // Check if already saved
      if (savedList.some((item) => item.idMeal === meal.idMeal)) {
        actionBtn.classList.add("heartActive");
      }

      actionBtn.addEventListener("click", function () {
        if (actionBtn.classList.contains("heartActive")) {
          removeFromCookbook(meal.idMeal);
          actionBtn.classList.remove("heartActive");
        } else {
          saveToCookbook(meal);
          actionBtn.classList.add("heartActive");
        }
      });
    }

    // Assemble Card
    if (isCookbookMode) actionsDiv.appendChild(shareBtn);
    else {
      actionsDiv.appendChild(actionBtn);
      actionsDiv.appendChild(shareBtn);
    }

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(actionsDiv);
    card.appendChild(viewBtn);
    if (isCookbookMode) card.appendChild(actionBtn);

    resultsContainer.appendChild(card);
  });
}

// --- 6. MODAL DETAILS (UPDATED) ---

// Fetch full details (Handles both MealDB and Spoonacular)
function getRecipeDetails(id, source) {
  
  // 1. If it's from Spoonacular, fetch from there and convert format
  if (source === 'spoonacular') {
    const url = `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false&apiKey=${spoonApiKey}`;
    
    fetch(url)
      .then(response => response.json())
      .then(data => {
        // We must convert Spoonacular data to look like MealDB data
        // so openModal() can understand it without changes.
        const convertedMeal = {
          idMeal: data.id,
          strMeal: data.title,
          strMealThumb: data.image,
          strInstructions: data.instructions || data.summary || "No instructions found.",
        };

        // Convert Ingredients (Array -> strIngredient1, strMeasure1...)
        data.extendedIngredients.forEach((ing, index) => {
          if (index < 20) {
            convertedMeal[`strIngredient${index + 1}`] = ing.name;
            convertedMeal[`strMeasure${index + 1}`] = `${ing.amount} ${ing.unit}`;
          }
        });

        openModal(convertedMeal);
      })
      .catch(error => console.error("Spoonacular Error:", error));

  } else {
    // 2. Default: It's a standard MealDB recipe
    fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id)
      .then((response) => response.json())
      .then((data) => openModal(data.meals[0]))
      .catch(error => console.error("MealDB Error:", error));
  }
}

// Populate and show the popup window
function openModal(meal) {
  // --- [FIX] Safety check: Ensure modal elements exist before updating them
  if (!modalWindow) return;

  const title = document.querySelector("#modalTitle");
  const image = document.querySelector("#modalImage");
  const instructions = document.querySelector("#modalInstructions");
  const ingredientsList = document.querySelector("#modalIngredients");
  const modalSaveBtn = document.querySelector("#modalSaveBtn");
  const modalShareBtn = document.querySelector("#modalShareBtn");

  title.innerText = meal.strMeal;
  image.src = meal.strMealThumb;
  instructions.innerHTML = meal.strInstructions.replace(/\r\n/g, "<br><br>");

  // Loop through 20 possible ingredients
  ingredientsList.innerHTML = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal["strIngredient" + i];
    const measure = meal["strMeasure" + i];
    if (ingredient && ingredient.trim() !== "") {
      const li = document.createElement("li");
      li.textContent = measure + " " + ingredient;
      ingredientsList.appendChild(li);
    }
  }

  // Configure Modal Buttons
  const savedList = getSavedRecipes();
  const isSaved = savedList.some((item) => item.idMeal === meal.idMeal);

  if (isSaved) {
    modalSaveBtn.innerHTML = "&#10084; Saved";
    modalSaveBtn.classList.add("saveBtnActive");
  } else {
    modalSaveBtn.innerHTML = "&#9825; Add to Cookbook";
    modalSaveBtn.classList.remove("saveBtnActive");
  }

  modalSaveBtn.onclick = function () {
    const currentList = getSavedRecipes();
    if (currentList.some((item) => item.idMeal === meal.idMeal)) {
      removeFromCookbook(meal.idMeal);
      modalSaveBtn.innerHTML = "&#9825; Add to Cookbook";
      modalSaveBtn.classList.remove("saveBtnActive");
    } else {
      saveToCookbook(meal);
      modalSaveBtn.innerHTML = "&#10084; Saved";
      modalSaveBtn.classList.add("saveBtnActive");
    }
  };

  modalShareBtn.onclick = function () {
    navigator.clipboard.writeText(
      "Check out " + meal.strMeal + " at Mint & Measure!"
    );
    const oldText = modalShareBtn.innerHTML;
    modalShareBtn.innerHTML = "Copied!";
    setTimeout(() => (modalShareBtn.innerHTML = oldText), 1500);
  };

  modalWindow.style.display = "block";
}

// =============> VIDEOS <============== //

// We will wait until the entire page is loaded before trying to find the video element.
document.addEventListener('DOMContentLoaded', () => {

    // Use querySelector to grab the video element by its ID
    const myVideo = document.querySelector('#homepageVideo');

    // --- [FIX] Added check to make sure video exists (it might not be on every page)
    if (myVideo) {
        // Example: If you wanted the video to auto-play but be muted (good practice)
        // Note: Auto-playing is often blocked by browsers unless muted.
        // myVideo.muted = true;
        // myVideo.play(); 
        
        // Example: Logging an event when the user finishes the video
        myVideo.addEventListener('ended', () => {
            console.log('Try the Vietnamese dishes, it is MINT!');
        });
    }

});

// --- MENU VARIABLES ---
var menuOpen = false;

// --- MENU TOGGLE FUNCTION ---
window.toggleMenu = function() {
  var leaf = $('#hamburgerBox img'); // Select the mint leaf image

  if (!menuOpen) {
    // Open: Slide menu out & Rotate leaf
    $('.navMenu').css('top', '25px');
    leaf.addClass('leaf-rotate');
    menuOpen = true;
  } else {
    // Close: Slide menu back & Reset leaf
    $('.navMenu').css('top', '-400px');
    leaf.removeClass('leaf-rotate');
    menuOpen = false;
  }
}

// --- CLOSE FUNCTION ---
window.closeNav = function() {
  $('.navMenu').css('top', '-400px');
  // Reset the leaf rotation when a link is clicked
  $('#hamburgerBox img').removeClass('leaf-rotate');
  menuOpen = false;
}

// --- SOCIAL HAMBURGER MENU ---

// 1. Variable to track if menu is open or closed
var socialMenuOpen = false;

// 2. The Function triggered by onclick="toggleSocialMenu()"
window.toggleSocialMenu = function() {
  
  // Select the menu and the button image
  var socialMenu = $('.socialDiv');
  var socialIcon = $('.socialHamburgerImgBox img');

  if (!socialMenuOpen) {
    // OPEN IT: Slide to 10px from left
    socialMenu.css('left', '10px');
    socialIcon.addClass('social-rotate');
    socialMenuOpen = true;
  } else {
    // CLOSE IT: Slide back to -150px (hidden)
    socialMenu.css('left', '-150px');
    socialIcon.removeClass('social-rotate');
    socialMenuOpen = false;
  }
}

// Toggle Light/Dark theme logic <------------ //

// Toggle Light/Dark theme logic
const toggleBtn = document.querySelector("#themeToggle");
const root = document.querySelector("html");

// 1. Check for saved preference on page load
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  root.setAttribute("data-theme", savedTheme);
}

// 2. Single Event Listener to handle toggle and local storage
if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    const next = isDark ? "light" : "dark";
    
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
}

/* =========================================
   AUTO-OPEN COOKBOOK LOGIC
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Check if the URL has "?view=cookbook"
  const urlParams = new URLSearchParams(window.location.search);
  const shouldOpenCookbook = urlParams.get('view') === 'cookbook';

  // 2. If yes, simulate a click on the cookbook button
  if (shouldOpenCookbook) {
    // We use a small timeout to ensure the fade-in animation finishes first
    setTimeout(() => {
      if (typeof showCookbook === 'function') {
        showCookbook(); 
      }
      
      // Optional: Update the URL to remove "?view=cookbook" so it doesn't stuck
      window.history.replaceState({}, document.title, "recipes.html");
    }, 100);
  }
});