const router = require('express').Router();
const checkCredentials = require('../validations/checkCredentials');
const loginValidationFields = require('../validations/loginFields');
// const validateJWT = require('../validations/tokenValidations');

router.post('/', loginValidationFields, checkCredentials);
module.exports = router;
