const router = require('express').Router();
const usersController = require('../controllers/userControllers');

router.post('/', usersController.createUser);

module.exports = router;
