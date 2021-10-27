const usersService = require('../services/usersService');

const createUser = async (req, res, next) => {
  const { body } = req;
  const newUser = await usersService.createUser(body);

  if (newUser.err) return next(newUser.err)
  return res.status(201).json({ user: newUser });
};

module.exports = {
  createUser,
};
