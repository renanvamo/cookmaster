const recipesService = require('../services/recipesService');

const createRecipe = async (req, res, next) => {
  const { body, user } = req;
  const recipe = await recipesService.createRecipe(body, user);
  if (recipe.err) return next(recipe.err);

  return res.status(201).json({ recipe });
};

const getAllRecipes = async (_req, res) => {
  const recipes = await recipesService.getAllRecipes();

  return res.status(200).json(recipes);
};

const getRecipeById = async (req, res, next) => {
  const { id } = req.params; 
  const recipe = await recipesService.getRecipeById(id);

  if (recipe.err) return next(recipe.err);

  return res.status(200).json(recipe);
};

const updateRecipe = async (req, res) => {
  const { body, user, params: id } = req;

  const updatedRecipe = await recipesService.updateRecipe(id, body, user);
  return res.status(200).json(updatedRecipe);
};

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
};
