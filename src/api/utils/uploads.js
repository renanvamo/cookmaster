const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    const PATH = path.join(__dirname, '..', '..', 'uploads');
    callback(null, PATH);
  },
  filename: (req, _file, callback) => {
    const imageName = `${req.params.id}.jpeg`;
    callback(null, imageName);
  },
});

const upload = multer({ storage });

module.exports = {
  upload,
};
