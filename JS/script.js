const recipeDataUrl = "https://gist.githubusercontent.com/baiello/0a974b9c1ec73d7d0ed7c8abc361fc8e/raw/e598efa6ef42d34cc8d7e35da5afab795941e53e/recipes.json";

async function fetchAndDisplayRecipes() {
    try {
        const response = await fetch(recipeDataUrl);
        const recipes = await response.json();

        const recipeContainer = document.querySelector('.grid-recette');
        recipeContainer.innerHTML = '';

        recipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.classList.add('card-recette');

            recipeCard.innerHTML = `
                <img class="img-recette" src="images/JSON recipes/${recipe.image}" alt="${recipe.name}">
                <h2>${recipe.name}</h2>
                <div>
                    <h3>RECETTE</h3>
                    <p>${recipe.description}</p>
                </div>
                <div>
                    <h3>INGREDIENTS</h3>
                    <p>${recipe.ingredients.map(ing => `${ing.quantity || ''} ${ing.unit || ''} ${ing.ingredient}`).join(', ')}</p>
                </div>
            `;

            recipeContainer.appendChild(recipeCard);
        });

        updateRecipeCount(recipes.length);
    } catch (error) {
        console.error("Erreur lors de la récupération des recettes :", error);
    }
}

fetchAndDisplayRecipes();

const searchInput = document.querySelector('.searchbar');

function searchRecipes(recipes, query) {
    return recipes.filter(recipe => {
        const lowerCaseQuery = query.toLowerCase();

        return (
            recipe.name.toLowerCase().includes(lowerCaseQuery) ||
            recipe.description.toLowerCase().includes(lowerCaseQuery) ||
            recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(lowerCaseQuery))
        );
    });
}

function displayNoResultsMessage(container, query) {
    container.innerHTML = `
        <p>Aucune recette ne contient '${query}'. Vous pouvez chercher par exemple «tarte aux pommes», «poisson», etc.</p>
    `;
    updateRecipeCount(0);
}

async function setupSearchFeature() {
    try {
        const response = await fetch(recipeDataUrl);
        const recipes = await response.json();

        const recipeContainer = document.querySelector('.grid-recette');

        function displayAllRecipes() {
            recipeContainer.innerHTML = '';
            recipes.forEach(recipe => {
                const recipeCard = document.createElement('div');
                recipeCard.classList.add('card-recette');
                
                recipeCard.innerHTML = `
                    <img class="img-recette" src="images/JSON recipes/${recipe.image}" alt="${recipe.name}">
                    <h2>${recipe.name}</h2>
                    <div>
                        <h3>RECETTE</h3>
                        <p>${recipe.description}</p>
                    </div>
                    <div>
                        <h3>INGREDIENTS</h3>
                        <p>${recipe.ingredients.map(ing => `${ing.quantity || ''} ${ing.unit || ''} ${ing.ingredient}`).join(', ')}</p>
                    </div>
                `;

                recipeContainer.appendChild(recipeCard);
            });

            updateRecipeCount(recipes.length);
        }

        displayAllRecipes();

        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim();

            if (query.length <= 2) {
                displayAllRecipes();
            } else if (query.length >= 3) {
                const filteredRecipes = searchRecipes(recipes, query);

                if (filteredRecipes.length > 0) {
                    recipeContainer.innerHTML = '';
                    filteredRecipes.forEach(recipe => {
                        const recipeCard = document.createElement('div');
                        recipeCard.classList.add('card-recette');

                        recipeCard.innerHTML = `
                            <img class="img-recette" src="images/JSON recipes/${recipe.image}" alt="${recipe.name}">
                            <h2>${recipe.name}</h2>
                            <div>
                                <h3>RECETTE</h3>
                                <p>${recipe.description}</p>
                            </div>
                            <div>
                                <h3>INGREDIENTS</h3>
                                <p>${recipe.ingredients.map(ing => `${ing.quantity || ''} ${ing.unit || ''} ${ing.ingredient}`).join(', ')}</p>
                            </div>
                        `;

                        recipeContainer.appendChild(recipeCard);
                    });

                    updateRecipeCount(filteredRecipes.length);
                } else {
                    displayNoResultsMessage(recipeContainer, query);
                }
            }
        });
    } catch (error) {
        console.error("Erreur lors de la configuration de la recherche :", error);
    }
}

setupSearchFeature();

function searchRecipes(recipes, query) {
    const terms = query.split(',').map(term => term.trim().toLowerCase());

    return recipes.filter(recipe => {
        return terms.some(term => {
            const inName = recipe.name.toLowerCase().includes(term);

            const inDescription = recipe.description.toLowerCase().includes(term);

            const inIngredients = recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(term));

            return inName || inDescription || inIngredients;
        });
    });
}

function displayNoResultsMessage(container, query) {
    container.innerHTML = `
        <p>Aucune recette ne contient '${query}'. Essayez une recherche différente.</p>
    `;
}

function updateRecipeCount(count) {
    const recipeCountElement = document.getElementById('recipe-count');
    recipeCountElement.textContent = `${count} recette${count > 1 ? 's' : ''}`;
}

document.addEventListener('DOMContentLoaded', async () => {
    const filters = document.querySelectorAll('.filter');
    const selectedFilters = document.querySelector('.selected-filters');
    const recipeContainer = document.querySelector('.grid-recette');
    let recipes = [];
    let ingredients = new Set();
    let appliances = new Set();
    let utensils = new Set();

    async function fetchRecipes() {
        const response = await fetch(recipeDataUrl);
        const data = await response.json();
        return data;
    }

    function closeAllDropdowns() {
        const dropdowns = document.querySelectorAll('.filter-dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.classList.add('hidden');
        });
    }

    function isClickInsideFilter(target) {
        return target.closest('.filter') !== null;
    }

    document.addEventListener('click', (event) => {
        if (!isClickInsideFilter(event.target)) {
            closeAllDropdowns();
        }
    });

    function extractFilters(recipes) {
        ingredients.clear();
        appliances.clear();
        utensils.clear();

        recipes.forEach(recipe => {
            recipe.ingredients.forEach(item => ingredients.add(item.ingredient));
            appliances.add(recipe.appliance);
            recipe.ustensils.forEach(ustensil => utensils.add(ustensil));
        });
    }

    function displayRecipes(filteredRecipes) {
        recipeContainer.innerHTML = '';
        if (filteredRecipes.length === 0) {
            recipeContainer.innerHTML = `<p>Aucune recette ne correspond aux filtres sélectionnés.</p>`;
            return;
        }
        filteredRecipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.classList.add('card-recette');
            recipeCard.innerHTML = `
                <img src="images/JSON recipes/${recipe.image}" alt="${recipe.name}" class="img-recette">
                <h2>${recipe.name}</h2>
                <p>Temps de préparation: ${recipe.time} min</p>
                <p>Ingrédients: ${recipe.ingredients.map(item => item.ingredient).join(', ')}</p>
                <p>Appareil: ${recipe.appliance}</p>
                <p>Ustensiles: ${recipe.ustensils.join(', ')}</p>
            `;
            recipeContainer.appendChild(recipeCard);
        });
    }

    function filterRecipes() {
        const selectedTags = Array.from(document.querySelectorAll('.filter-tag'));
        const selectedIngredients = selectedTags
            .filter(tag => ingredients.has(tag.getAttribute('data-value')))
            .map(tag => tag.getAttribute('data-value'));

        const selectedAppliances = selectedTags
            .filter(tag => appliances.has(tag.getAttribute('data-value')))
            .map(tag => tag.getAttribute('data-value'));

        const selectedUtensils = selectedTags
            .filter(tag => utensils.has(tag.getAttribute('data-value')))
            .map(tag => tag.getAttribute('data-value'));

        const filteredRecipes = recipes.filter(recipe => {
            const hasIngredients = selectedIngredients.every(ingredient =>
                recipe.ingredients.some(item => item.ingredient === ingredient)
            );
            const hasAppliance = selectedAppliances.length === 0 || selectedAppliances.includes(recipe.appliance);
            const hasUtensils = selectedUtensils.every(utensil => recipe.ustensils.includes(utensil));

            return hasIngredients && hasAppliance && hasUtensils;
        });

        extractFilters(filteredRecipes);
        updateFilterLists();
        displayRecipes(filteredRecipes);
    }

    function updateFilterLists() {
        populateFilterList('ingredients-list', Array.from(ingredients));
        populateFilterList('appliances-list', Array.from(appliances));
        populateFilterList('utensils-list', Array.from(utensils));
    }

    function populateFilterList(listId, items) {
        const list = document.getElementById(listId);
        list.innerHTML = '';
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            li.classList.add('filter-item');
            li.setAttribute('data-value', item);

            const existingTag = document.querySelector(`.filter-tag[data-value="${item}"]`);
            if (!existingTag) {
                li.addEventListener('click', () => selectFilter(item, listId));
                list.appendChild(li);
            }
        });
    }

    function selectFilter(value, listId) {
        if (document.querySelector(`.filter-tag[data-value="${value}"]`)) return;

        const tag = document.createElement('div');
        tag.classList.add('filter-tag');
        tag.setAttribute('data-value', value);
        tag.innerHTML = `${value} <span class="remove-tag">×</span>`;

        selectedFilters.appendChild(tag);

        const listItem = document.querySelector(`.filter-item[data-value="${value}"]`);
        if (listItem) {
            listItem.style.display = 'none';
        }

        filterRecipes();

        tag.querySelector('.remove-tag').addEventListener('click', () => {
            tag.remove();
            if (listItem) {
                listItem.style.display = '';
            }
            filterRecipes();
        });
    }

    filters.forEach(filter => {
        const button = filter.querySelector('.filter-button');
        const dropdown = filter.querySelector('.filter-dropdown');
        const searchInput = filter.querySelector('.filter-search');
        const list = filter.querySelector('.filter-list');

        button.addEventListener('click', () => {
            if (!dropdown.classList.contains('hidden')) {
                dropdown.classList.add('hidden');
                return;
            }

            closeAllDropdowns();
            dropdown.classList.toggle('hidden');
        });

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const items = Array.from(list.querySelectorAll('.filter-item'));

            items.forEach(item => {
                if (item.textContent.toLowerCase().includes(query)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    recipes = await fetchRecipes();
    extractFilters(recipes);

    populateFilterList('ingredients-list', Array.from(ingredients));
    populateFilterList('appliances-list', Array.from(appliances));
    populateFilterList('utensils-list', Array.from(utensils));

    displayRecipes(recipes);
});
