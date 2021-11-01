const router = require('express').Router();
const imagesController = require('../controllers/imagesController');

router.get('/:id.jpeg', imagesController.getImages);

module.exports = router;
