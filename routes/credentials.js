const express = require('express');
const router = express.Router();
const Controller = require('../controllers/credentials');
const checkAuth = require('../middlewares/auth')

router.get('/test-user', checkAuth.auth, Controller.testCredentials);
router.post('/add-user/:user', Controller.postCredentials);
router.post('/login', Controller.postCredentialsLogin);

module.exports = router;