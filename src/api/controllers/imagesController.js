const imagesService = require('../services/imagesService');

const getImages = async (req, res, next) => {
  const { id } = req.params;
  
  const imagePath = await imagesService.getImages(id);
  if (imagePath.err) {
    return next(imagePath.err);
  }

  // https://newbedev.com/nodejs-how-to-read-and-output-jpg-image
  res.writeHead(200, { 'Content-Type': 'image/jpeg' });
  return res.end(imagePath);
};

module.exports = {
  getImages,
};
