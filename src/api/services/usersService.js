const usersModel = require('../models/usersModel');

const createError = (code, message) => ({ err: { code, message } });

const createUser = async (data) => {
  const { name, password, email, role = 'user' } = data;

  const newUser = await usersModel.createUser(name, email, password, role);
  // createError('badRequest', 'Invalid entries. Try again.');
  
  if (!newUser) return createError('conflict', 'Email already registered');
  return newUser;
};

module.exports = {
  createUser,
}