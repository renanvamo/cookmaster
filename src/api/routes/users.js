const router = require('express').Router();
const usersController = require('../controllers/usersController');
const { checkToken } = require('../validations/checkToken');

router.post('/', usersController.createUser);
router.post('/admin', checkToken, usersController.createAdminUser);

module.exports = router;
