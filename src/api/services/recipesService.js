const { createError } = require('../middlewares/errors');
const recipesModel = require('../models/recipesModel');
const { recipeValidations } = require('../validations/validations');

const hasPermission = (role, ownerUser, reqUser) => role === 'admin' || ownerUser === reqUser;

const createRecipe = async (body, userId) => {
  const { name, ingredients, preparation } = body;

  const { error: validationError } = recipeValidations(body);
  if (validationError) return createError('badRequest', 'Invalid entries. Try again.');

  const url = 'url_da_imagem';
  const newRecipe = await recipesModel.createRecipe(name, ingredients, preparation, userId, url);

  return newRecipe;
};

const getAllRecipes = async () => {
  const recipes = await recipesModel.getAllRecipes();

  return recipes;
};

const getRecipeById = async (id) => {
  const recipe = await recipesModel.getRecipeById(id);

  if (!recipe) return createError('notFound', 'recipe not found');

  return recipe;
};

const updateRecipe = async (id, body, userId, role) => {
  const { name, preparation, ingredients } = body;

  const recipe = await recipesModel.getRecipeById(id);

  if (!hasPermission(role, recipe.userId, userId)) {
    return createError('unauthorized', 'you can update only your recipes');
  }

  const updatedRecipe = await recipesModel.updateRecipe(
    id,
    name,
    ingredients,
    preparation,
  );

  return updatedRecipe;
};

const deleteRecipe = async (id, userId, role) => {
  const recipe = await recipesModel.getRecipeById(id);
  
  console.log(id, userId, role, recipe);
  
  if (!hasPermission(role, recipe.userId, userId)) {
    return createError('unauthorized', 'you can change only your recipes');
  }

  const wasDeleted = await recipesModel.deleteRecipe(id);

  if (!wasDeleted) return createError('not_found', 'recipe not found');

  return wasDeleted;
};

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
};
