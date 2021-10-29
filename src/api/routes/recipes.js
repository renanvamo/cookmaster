const router = require('express').Router();
const recipesController = require('../controllers/recipesController');
const { checkToken } = require('../validations/checkToken');
// const validateJWT = require('../validations/tokenValidations');

router.post('/', checkToken, recipesController.createRecipe);

module.exports = router;