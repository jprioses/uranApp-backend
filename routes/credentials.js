const express = require('express');
const router = express.Router();
const Controllers = require('../controllers/credentials');
const checkAuth = require('../middlewares/auth')

router.get('/test-user', checkAuth.auth, Controllers.testCredentials);
router.post('/add-user/:user', Controllers.postCredentials);
router.post('/login', Controllers.postCredentialsLogin);

module.exports = router;