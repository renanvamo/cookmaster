const usersModel = require('../models/usersModel');

const createError = (code, message, joi = false) => ({ err: { code, message, joi } });

const createUser = async (data) => {
  const { name, password, email, role = 'user' } = data;

  const newUser = await usersModel.createUser(name, email, password, role);

  if (!newUser) return createError('invalidData', 'Invalid entries. Try again.');
  return newUser;
};