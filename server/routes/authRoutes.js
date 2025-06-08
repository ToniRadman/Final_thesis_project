const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { registerUserSchema, loginSchema } = require('../validators/authValidator');
const { validate } = require('../middleware/validate');

router.post('/register', validate(registerUserSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);

module.exports = router;