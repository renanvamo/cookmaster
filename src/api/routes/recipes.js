const router = require('express').Router();
const recipesController = require('../controllers/recipesController');
const { checkToken } = require('../validations/checkToken');
// const validateJWT = require('../validations/tokenValidations');

router.post('/', checkToken, recipesController.createRecipe);
router.get('/', recipesController.getAllRecipes);
router.get('/:id', recipesController.getRecipeById);
router.put('/:id', checkToken, recipesController.updateRecipe);
router.delete('/:id', recipesController.deleteRecipe);

module.exports = router;
