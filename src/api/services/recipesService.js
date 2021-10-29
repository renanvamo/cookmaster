const recipesModel = require('../models/recipesModel');

const createRecipe = async (body, user) => {
  const { name, ingredients, preparation } = body;

  const url = 'url_da_imagem';
  const newRecipe = await recipesModel.createRecipe(name, ingredients, preparation, user, url);

  return newRecipe;
};

module.exports = {
  createRecipe,
};
