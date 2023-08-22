const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const auth = require('../middlewares/auth')

router.get('/test-user', auth.auth, UserController.userTest);
router.post('/add-user', UserController.addUSer);
router.post('/login', UserController.login);

module.exports = router;