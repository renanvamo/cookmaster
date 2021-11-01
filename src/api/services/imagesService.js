const { createError } = require('../middlewares/errors');
const imagesModel = require('../models/imagesModel');

const getImages = async (id) => {
  const imagePath = await imagesModel.getImages(id);

  if (!imagePath) return createError('notFound', 'image not found');
  return imagePath;
};

module.exports = {
  getImages,
};
