const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');

// @ENDPOINT http://localhost:8000/api/users
router.get('/users', userController.listUsers);

// @ENDPOINT http://localhost:8000/api/user/update-role
router.patch('/user/update-role', userController.updateRole);

// @ENDPOINT http://localhost:8000/api/user/:id
router.delete('/user/:id', userController.deleteUser);

module.exports = router;
