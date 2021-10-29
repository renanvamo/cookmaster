const router = require('express').Router();
const recipesController = require('../controllers/recipesController');
const { checkToken } = require('../validations/checkToken');
const { recipeValidations } = require('../validations/validations');
// const validateJWT = require('../validations/tokenValidations');

router.post('/', checkToken, recipeValidations, recipesController.createRecipe);

module.exports = router;
