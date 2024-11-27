import { displayRecipes } from "../JS/script.js";

document.body.innerHTML = `
    <div class="grid-recette"></div>
`;

test("Met à jour l'affichage des recettes", () => {
    const mockUpdateRecipeCount = jest.fn();

    const filteredRecipes = [
        {
            name: "Recette 1",
            image: "recette1.jpg",
            time: 30,
            ingredients: [{ ingredient: "Sucre" }],
            appliance: "Four",
            ustensils: ["Cuillère"],
        },
        {
            name: "Recette 2",
            image: "recette2.jpg",
            time: 45,
            ingredients: [{ ingredient: "Farine" }],
            appliance: "Micro-ondes",
            ustensils: ["Bol"],
        },
    ];

    displayRecipes(filteredRecipes, mockUpdateRecipeCount);

    const recipeContainer = document.querySelector(".grid-recette");

    expect(recipeContainer.innerHTML).toContain("Recette 1");
    expect(recipeContainer.innerHTML).toContain("Recette 2");

    expect(mockUpdateRecipeCount).toHaveBeenCalledTimes(1);
    expect(mockUpdateRecipeCount).toHaveBeenCalledWith(2);
});
