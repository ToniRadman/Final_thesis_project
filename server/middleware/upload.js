const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // folder za upload slike, mora postojati
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // npr. 1654254523.jpg
  }
});

const upload = multer({ storage: storage });

module.exports = upload;