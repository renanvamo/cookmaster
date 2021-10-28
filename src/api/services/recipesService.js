const recipesModel = require('../models/recipesModel');

const createRecipe = async () => {
  const newRecipe = await recipesModel.createRecipe();

  return newRecipe;
};

module.exports = {
  createRecipe,
};
