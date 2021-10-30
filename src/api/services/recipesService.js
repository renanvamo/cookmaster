const { createError } = require('../middlewares/errors');
const recipesModel = require('../models/recipesModel');
const { recipeValidations } = require('../validations/validations');

const createRecipe = async (body, user) => {
  const { name, ingredients, preparation } = body;

  const { error: validationError } = recipeValidations(body);
  if (validationError) return createError('badRequest', 'Invalid entries. Try again.');

  const url = 'url_da_imagem';
  const newRecipe = await recipesModel.createRecipe(name, ingredients, preparation, user, url);

  return newRecipe;
};

const getAllRecipes = async () => {
  const recipes = await recipesModel.getAllRecipes();

  return recipes;
};

module.exports = {
  createRecipe,
  getAllRecipes,
};
