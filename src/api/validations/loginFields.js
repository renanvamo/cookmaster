// const jwt = require('jsonwebtoken');
// const SECRET = 'segredo';

const loginValidationFields = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(401).json({ message: 'All fields must be filled' });

  next();
};

module.exports = loginValidationFields;
