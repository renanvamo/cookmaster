const SECRET = 'segredo';
const jwt = require('jsonwebtoken');

const checkToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ message: 'missing auth token' });

  try {
    const decode = jwt.verify(token, SECRET);
    req.userId = decode.userId;
    req.role = decode.role;
    next();
  } catch (_err) {
    return res.status(401).json({ message: 'jwt malformed' });
  }
};

module.exports = {
  checkToken,
};
