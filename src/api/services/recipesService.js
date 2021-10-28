const recipesModel = require('../models/recipesModel');

const createRecipe = async (body) => {
  const { name, ingredients, preparation } = body;

  const url = 'url_da_imagem';
  const newRecipe = await recipesModel.createRecipe(name, ingredients, preparation, url);

  return newRecipe;
};

module.exports = {
  createRecipe,
};
