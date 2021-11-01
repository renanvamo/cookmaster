const usersService = require('../services/usersService');

const createUser = async (req, res, next) => {
  const { body, role } = req;
  const newUser = await usersService.createUser(body, role);

  if (newUser.err) return next(newUser.err);
  return res.status(201).json({ user: newUser });
};

const createAdminUser = async (req, res, next) => {
  const { body, role } = req;

  const newUser = await usersService.createUser(body, role, true);

  if (newUser.err) return next(newUser.err);
  return res.status(201).json({ user: newUser });
};

module.exports = {
  createUser,
  createAdminUser,
};
