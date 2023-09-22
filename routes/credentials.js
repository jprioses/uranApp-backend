const express = require('express');
const router = express.Router();
const Controllers = require('../controllers/credentials');
const checkAuth = require('../middlewares/auth')

router.get('/test', checkAuth.auth, Controllers.testCredentials);
router.post('/add/:user_id', checkAuth.auth, Controllers.createCredentials);
router.post('/login', Controllers.login);
router.put('/update/:user_id', checkAuth.auth, Controllers.updateCredentials);

router.get('/get/:user_id', checkAuth.auth, Controllers.getCredentials);

module.exports = router;