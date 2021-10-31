const recipesService = require('../services/recipesService');

const createRecipe = async (req, res, next) => {
  const { body, userId } = req;
  const recipe = await recipesService.createRecipe(body, userId);
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
  const { body, params, userId } = req;
  const { id } = params;
  
  const updatedRecipe = await recipesService.updateRecipe(id, body, userId);
  return res.status(200).json(updatedRecipe);
};

const deleteRecipe = async (req, res, next) => {
  const { id } = req.params;

  const wasDeleted = recipesService.deleteRecipe(id);

  if (wasDeleted.err) return next(wasDeleted.err);

  return res.status(204);
};

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
};
