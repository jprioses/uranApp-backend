const express = require('express');
const router = express.Router();
const UserDataController = require('../controllers/userData');
const checkAuth = require('../middlewares/auth')

router.get('/test-user', UserDataController.userDataTest);
router.post('/add-user/:role/:godfather?/:leader?', checkAuth.auth, UserDataController.createUserData);
router.get('/user-dashboard', checkAuth.auth ,UserDataController.redUserDashboard);
router.get('/get-users/:role/:idRef', checkAuth.auth ,UserDataController.readUsersData);
router.put('/update-user//:role/:godfather?/:leader?', checkAuth.auth ,UserDataController.updateUserData);

module.exports = router;