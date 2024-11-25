const recipeDataUrl =
    "https://gist.githubusercontent.com/baiello/0a974b9c1ec73d7d0ed7c8abc361fc8e/raw/e598efa6ef42d34cc8d7e35da5afab795941e53e/recipes.json";

let recipes = [];
let ingredients = new Set();
let appliances = new Set();
let utensils = new Set();

const recipeContainer = document.querySelector(".grid-recette");
const searchInput = document.querySelector(".searchbar");
const selectedFilters = document.querySelector(".selected-filters");

async function fetchRecipes() {
    const response = await fetch(recipeDataUrl);
    return response.json();
}

export function updateRecipeCount(count) {
    const recipeCountElement = document.getElementById("recipe-count");
    if (recipeCountElement) {
        recipeCountElement.textContent = `${count} recette${count > 1 ? "s" : ""}`;
    }
}

function closeAllDropdowns() {
    const dropdowns = document.querySelectorAll(".filter-dropdown");
    dropdowns.forEach((dropdown) => dropdown.classList.add("hidden"));
}

function isClickInsideFilter(target) {
    return target.closest(".filter") !== null;
}

function extractFilters(recipes) {
    ingredients.clear();
    appliances.clear();
    utensils.clear();

    recipes.forEach((recipe) => {
        recipe.ingredients.forEach((item) => ingredients.add(item.ingredient));
        appliances.add(recipe.appliance);
        recipe.ustensils.forEach((ustensil) => utensils.add(ustensil));
    });
}

function displayRecipes(filteredRecipes) {
    recipeContainer.innerHTML = "";

    if (filteredRecipes.length === 0) {
        recipeContainer.innerHTML =
            "<p>Aucune recette ne correspond aux filtres sélectionnés.</p>";
        updateRecipeCount(0);
        return;
    }

    filteredRecipes.forEach((recipe) => {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("card-recette");
        recipeCard.innerHTML = `
            <img src="images/JSONrecipes/${recipe.image}" alt="${recipe.name}" class="img-recette">
            <h2>${recipe.name}</h2>
            <p>Temps de préparation: ${recipe.time} min</p>
            <p>Ingrédients: ${recipe.ingredients
                .map((item) => item.ingredient)
                .join(", ")}</p>
            <p>Appareil: ${recipe.appliance}</p>
            <p>Ustensiles: ${recipe.ustensils.join(", ")}</p>
        `;
        recipeContainer.appendChild(recipeCard);
    });

    updateRecipeCount(filteredRecipes.length);
}

function filterRecipes() {
    const query = searchInput.value.trim().toLowerCase();
    const selectedTags = Array.from(document.querySelectorAll(".filter-tag"));

    const selectedIngredients = selectedTags
        .filter((tag) => ingredients.has(tag.getAttribute("data-value")))
        .map((tag) => tag.getAttribute("data-value"));

    const selectedAppliances = selectedTags
        .filter((tag) => appliances.has(tag.getAttribute("data-value")))
        .map((tag) => tag.getAttribute("data-value"));

    const selectedUtensils = selectedTags
        .filter((tag) => utensils.has(tag.getAttribute("data-value")))
        .map((tag) => tag.getAttribute("data-value"));

    const searchTerms = query
        .split(",")
        .map((term) => term.trim())
        .filter((term) => term.length > 0);

    const filteredRecipes = recipes.filter((recipe) => {
        const matchesSearchQuery =
            searchTerms.length === 0 ||
            searchTerms.some(
                (term) =>
                    recipe.name.toLowerCase().includes(term) ||
                    recipe.description.toLowerCase().includes(term) ||
                    recipe.ingredients.some((ing) =>
                        ing.ingredient.toLowerCase().includes(term)
                    )
            );

        const hasIngredients = selectedIngredients.every((ingredient) =>
            recipe.ingredients.some((item) => item.ingredient === ingredient)
        );
        const hasAppliance =
            selectedAppliances.length === 0 ||
            selectedAppliances.includes(recipe.appliance);
        const hasUtensils = selectedUtensils.every((utensil) =>
            recipe.ustensils.includes(utensil)
        );

        return matchesSearchQuery && hasIngredients && hasAppliance && hasUtensils;
    });

    extractFilters(filteredRecipes);
    updateFilterLists();
    displayRecipes(filteredRecipes);
}

function updateFilterLists() {
    populateFilterList("ingredients-list", Array.from(ingredients));
    populateFilterList("appliances-list", Array.from(appliances));
    populateFilterList("utensils-list", Array.from(utensils));
}

function populateFilterList(listId, items) {
    const list = document.getElementById(listId);
    list.innerHTML = "";

    items.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        li.classList.add("filter-item");
        li.setAttribute("data-value", item);

        const existingTag = document.querySelector(
            `.filter-tag[data-value="${item}"]`
        );
        if (!existingTag) {
            li.addEventListener("click", () => selectFilter(item, listId));
            list.appendChild(li);
        }
    });
}

function selectFilter(value, listId) {
    if (document.querySelector(`.filter-tag[data-value="${value}"]`)) return;

    const tag = document.createElement("div");
    tag.classList.add("filter-tag");
    tag.setAttribute("data-value", value);
    tag.innerHTML = `${value} <span class="remove-tag">×</span>`;

    selectedFilters.appendChild(tag);

    const listItem = document.querySelector(
        `.filter-item[data-value="${value}"]`
    );
    if (listItem) {
        listItem.style.display = "none";
    }

    filterRecipes();

    tag.querySelector(".remove-tag").addEventListener("click", () => {
        tag.remove();
        if (listItem) {
            listItem.style.display = "";
        }
        filterRecipes();
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    const filters = document.querySelectorAll(".filter");

    document.addEventListener("click", (event) => {
        if (!isClickInsideFilter(event.target)) {
            closeAllDropdowns();
        }
    });

    filters.forEach((filter) => {
        const button = filter.querySelector(".filter-button");
        const dropdown = filter.querySelector(".filter-dropdown");
        const searchInput = filter.querySelector(".filter-search");
        const list = filter.querySelector(".filter-list");

        button.addEventListener("click", () => {
            closeAllDropdowns();
            dropdown.classList.toggle("hidden");
        });

        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase();
            const items = Array.from(list.querySelectorAll(".filter-item"));

            items.forEach((item) => {
                item.style.display = item.textContent
                    .toLowerCase()
                    .includes(query)
                    ? ""
                    : "none";
            });
        });
    });

    searchInput.addEventListener("input", filterRecipes);
    recipes = await fetchRecipes();
    extractFilters(recipes);
    updateFilterLists();
    displayRecipes(recipes);
    updateRecipeCount(recipes.length);
});
