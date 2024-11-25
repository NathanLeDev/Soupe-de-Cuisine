import { updateRecipeCount } from "../JS/script.js";

describe("updateRecipeCount", () => {
    beforeEach(() => {
        document.body.innerHTML = '<span id="recipe-count"></span>';
    });

    it("met à jour le compteur avec une recette (singulier)", () => {
        updateRecipeCount(1);
        const recipeCountElement = document.getElementById("recipe-count");
        expect(recipeCountElement.textContent).toBe("1 recette");
    });

    it("met à jour le compteur avec plusieurs recettes (pluriel)", () => {
        updateRecipeCount(5);
        const recipeCountElement = document.getElementById("recipe-count");
        expect(recipeCountElement.textContent).toBe("5 recettes");
    });

    it("met à jour le compteur avec zéro recette", () => {
        updateRecipeCount(0);
        const recipeCountElement = document.getElementById("recipe-count");
        expect(recipeCountElement.textContent).toBe("0 recette");
    });
});
