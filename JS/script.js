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

function updateRecipeCount(count) {
    const recipeCountElement = document.getElementById('recipe-count');
    recipeCountElement.textContent = `${count} recette${count > 1 ? 's' : ''}`;
}
