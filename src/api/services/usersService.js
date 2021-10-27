const usersModel = require('../models/usersModel');
const { userValidations } = require('../validations/validations');

const createError = (code, message) => ({ err: { code, message } });

const createUser = async (data) => {
  const { name, password, email, role = 'user' } = data;

  const { error: validationError } = userValidations(data);
  if (validationError) return createError('badRequest', 'Invalid entries. Try again.');

  const newUser = await usersModel.createUser(name, email, password, role);
  
  if (!newUser) return createError('conflict', 'Email already registered');
  return newUser;
};

module.exports = {
  createUser,
};
