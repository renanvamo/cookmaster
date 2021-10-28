const recipesService = require('../services/recipesService');

const createRecipe = async (_req, _res, _next) => {
  const newRecipe = await recipesService.createRecipe();
  // const { body } = req;
  // const newUser = await usersService.createUser(body);

  // if (newUser.err) return next(newUser.err);
  // return res.status(201).json({ user: newUser });
  return newRecipe;
};

module.exports = {
  createRecipe,
};
