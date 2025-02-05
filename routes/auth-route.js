const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/auth-controller');

// @ENDPOINT http://localhost:8000/api/register
router.post('/register', authControllers.register);

// @ENDPOINT http://localhost:8000/api/login
router.post('/login', authControllers.login);

module.exports = router;
