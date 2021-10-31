const router = require('express').Router();
const recipesController = require('../controllers/recipesController');
const { checkToken } = require('../validations/checkToken');

router.post('/', checkToken, recipesController.createRecipe);
router.get('/', recipesController.getAllRecipes);
router.get('/:id', recipesController.getRecipeById);
router.put('/:id', checkToken, recipesController.updateRecipe);
router.delete('/:id', checkToken, recipesController.deleteRecipe);

module.exports = router;
