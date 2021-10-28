const router = require('express').Router();
const recipesController = require('../controllers/recipesController');
// const validateJWT = require('../validations/tokenValidations');

router.post('/', recipesController.createRecipe);

module.exports = router;
