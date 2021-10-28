const usersServices = require('../services/usersService');

const checkCredentials = async (req, res) => {
  const { body } = req;
  
  const token = await usersServices.findUserByEmail(body);
  if (token.err) return res.status(401).json({ message: token.err.message });
  return res.status(200).json({ token });
};

module.exports = checkCredentials;
