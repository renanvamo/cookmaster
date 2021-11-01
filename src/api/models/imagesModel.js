const recipesModel = require('./recipesModel');

const getImages = async (id) => {
  const recipe = await recipesModel.getRecipeById(id);

  return recipe.image;
};

module.exports = {
  getImages,
};
