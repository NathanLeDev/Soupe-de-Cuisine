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
    } catch (error) {
        console.error("Erreur lors de la récupération des recettes :", error);
    }
}

fetchAndDisplayRecipes();