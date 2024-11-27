import { fetchRecipes } from "../JS/script.js";

test("fetchRecipes should throw an error when fetch API fails", async () => {
  global.fetch = jest.fn().mockRejectedValue(new Error("Failed to fetch"));

  await expect(fetchRecipes()).rejects.toThrow("Failed to fetch");

  global.fetch.mockRestore();
});