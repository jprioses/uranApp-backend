const express = require('express');
const router = express.Router();
const Controllers = require('../controllers/notifications');
const checkAuth = require('../middlewares/auth')

router.get('/test', Controllers.test);
router.get('/get/:page?/:limit?', checkAuth.auth ,Controllers.getAllNotifications);
router.get('/get-last/:limit?', checkAuth.auth ,Controllers.getLastNotifications);
router.get('/get-one/:id', checkAuth.auth ,Controllers.getNotifications);
router.delete('/delete/:id', checkAuth.auth ,Controllers.deleteNotifications);
router.get('/recover-data/:id', checkAuth.auth ,Controllers.recoverData);

module.exports = router;