const express = require('express');
const router = express.Router();
const Controller = require('../controllers/users');
const checkAuth = require('../middlewares/auth')

router.get('/test-users', Controller.testUsers);
router.post('/add-users/:role/:ref_godfather?/:ref_leader?', checkAuth.auth, Controller.postUsers);
router.get('/get-users-dashboard', checkAuth.auth ,Controller.getUsersDashboard);
router.get('/get-users/:role/:ref', checkAuth.auth ,Controller.getUsers);
router.put('/update-users/:id', checkAuth.auth ,Controller.putUsers);
router.delete('/delete-users/:id', checkAuth.auth ,Controller.deleteUsers);

module.exports = router;