const jwt = require('jsonwebtoken');
const { createError } = require('../middlewares/errors');
const usersModel = require('../models/usersModel');
const { userValidations } = require('../validations/validations');

const SECRET = 'segredo';

const createToken = (user) => {
  const jwtConfig = {
    expiresIn: '10d',
    algorithm: 'HS256',
  };

  const { _id, role } = user; 
  const token = jwt.sign({ userId: _id, role }, SECRET, jwtConfig);
  return token;
};

const createUser = async (data, role, admin = false) => {
  const { name, password, email } = data;

  const { error: validationError } = userValidations(data);
  if (validationError) return createError('badRequest', 'Invalid entries. Try again.');

  if (admin && role !== 'admin') {
    return createError('forbidden', 'Only admins can register new admins');
  }

  const newUser = await usersModel.createUser(name, email, password, role);
  
  if (!newUser) return createError('conflict', 'Email already registered');
  return newUser;
};

const findUserByEmail = async (data) => {
  const { email, password } = data;

  const user = await usersModel.findUserByEmail(email);

  if (!user) return createError('not_found', 'Incorrect username or password');
  if (user.password !== password) return createError('not_found', 'Incorrect username or password');

  const token = createToken(user);
  return token;
};

module.exports = {
  createUser,
  findUserByEmail,
  createToken,
};
