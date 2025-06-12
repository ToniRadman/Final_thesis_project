const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const {
  getAllUsers,
  getUserById,
  updateUser,
  updateOwnProfile,
  deleteUser,
} = require('../controllers/userController');
const { updateUserSchema } = require('../validators/userValidator');
const { validate } = require('../middleware/validate');

// Sve rute su zaštićene, korisnik mora biti prijavljen
router.use(authenticateToken);

// Dohvati sve korisnike - samo ADMIN
router.get('/', authorizeRoles('ADMIN'), getAllUsers);

// Dohvati korisnika po ID - ADMIN ili sam korisnik
router.get('/:id', getUserById);

// Update korisnika - ADMIN ili sam korisnik
router.put('/:id', validate(updateUserSchema), updateUser);

// Update vlastitog profila - samo korisnik
router.patch('/me', validate(updateUserSchema), updateOwnProfile);

// Delete korisnika - samo ADMIN
router.delete('/:id', authorizeRoles('ADMIN'), deleteUser);

module.exports = router;