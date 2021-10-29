const recipesService = require('../services/recipesService');

const createRecipe = async (req, res, _next) => {
  const { body, user } = req;
  const recipe = await recipesService.createRecipe(body, user);
  // const { body } = req;
  // const newUser = await usersService.createUser(body);

  // if (newUser.err) return next(newUser.err);
  // return res.status(201).json({ user: newUser });
  return res.status(201).json({ recipe });
};

module.exports = {
  createRecipe,
};
