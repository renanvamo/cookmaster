const ERROR_CODES = {
  badRequest: 400,
  notFound: 404,
  conflict: 409,
  invalidData: 422,
  notDefined: 500,
};

function getErrors(error, _req, res, _next) {
  const { message } = error;
  const status = ERROR_CODES[error.code] || ERROR_CODES.notDefined;

  return res.status(status).json({ message });
}

module.exports = getErrors;
