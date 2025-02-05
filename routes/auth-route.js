const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/auth-controller');
const {
  validateWithZod,
  registerSchema,
  loginSchema,
} = require('../middlewares/validators');

// @ENDPOINT http://localhost:8000/api/register
router.post(
  '/register',
  validateWithZod(registerSchema),
  authControllers.register
);

// @ENDPOINT http://localhost:8000/api/login
router.post('/login', validateWithZod(loginSchema), authControllers.login);

// @ENDPOINT http://localhost:8000/api/current-user
router.get('/current-user', authControllers.currentUser);

module.exports = router;
