const SECRET = 'segredo';
const jwt = require('jsonwebtoken');

const checkToken = (req, res, next) => {
  const token = req.headers.authorization;
  console.log('oi');

  try {
    const decode = jwt.verify(token, SECRET);
    req.user = decode.userId;
    next();
  } catch (_err) {
    return res.status(401).json({ message: 'jwt malformed' });
  }
};

module.exports = {
  checkToken,
};
