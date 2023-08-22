const express = require('express');
const router = express.Router();
const UserDataController = require('../controllers/userData');

router.get('/test-user', UserDataController.userDataTest);
router.post('/add-user/:role/:godfather?/:leader?', UserDataController.createUserData);

module.exports = router;