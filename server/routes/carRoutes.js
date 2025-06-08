const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const { carSchema } = require('../validators/carValidator');
const { validate } = require('../middleware/validate');
const {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  uploadCarImage,
} = require('../controllers/carController');
const upload = require('../middleware/upload');

router.use(authenticateToken);

// Svi mogu vidjeti vozila (ako želiš, možeš skinuti middleware sa getAllCars/getCarById)
router.get('/', getAllCars);
router.get('/:id', getCarById);

// Za kreiranje, update i delete samo ZAPOSLENIK ili ADMIN
router.post('/', authorizeRoles('ZAPOSLENIK', 'ADMIN'), validate(carSchema), createCar);
router.put('/:id', authorizeRoles('ZAPOSLENIK', 'ADMIN'), validate(carSchema), updateCar);
router.delete('/:id', authorizeRoles('ADMIN'), deleteCar);

router.post(
  '/:id/image',
  authorizeRoles('ZAPOSLENIK', 'ADMIN'),
  upload.single('image'),
  uploadCarImage
);

module.exports = router;