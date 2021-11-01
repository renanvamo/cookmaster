const imagesModel = require('../models/imagesModel');

const getImages = async (id) => {
  const imagePath = await imagesModel.getImages(id);

  if (imagePath) return imagePath;
  return null;
};

module.exports = {
  getImages,
};
