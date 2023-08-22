const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const checkAuth = require('../middlewares/auth')

router.get('/test-user', checkAuth.auth, UserController.userTest);
router.post('/add-user/:userData', UserController.createUser);
router.post('/login', UserController.login);

module.exports = router;