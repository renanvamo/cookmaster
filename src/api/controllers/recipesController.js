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
  const { body, params, userId, role } = req;
  const { id } = params;
  
  const updatedRecipe = await recipesService.updateRecipe(id, body, userId, role);
  return res.status(200).json(updatedRecipe);
};

const deleteRecipe = async (req, res, next) => {
  const { id } = req.params;
  const { userId, role } = req;

  const wasDeleted = await recipesService.deleteRecipe(id, userId, role);

  if (wasDeleted.err) return next(wasDeleted.err);

  return res.status(204).send();
};

const uploadImage = async (req, res, next) => {
  const { id } = req.params;
  const { userId, role } = req;

  const uploadedImage = await recipesService.uploadImage(id, userId, role);

  if (uploadedImage.err) return next(uploadedImage.err);

  return res.status(200).json(uploadedImage);
};

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  uploadImage,
};
