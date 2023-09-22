const express = require('express');
const router = express.Router();
const Controllers = require('../controllers/users');
const checkAuth = require('../middlewares/auth')
const uploads = require('../middlewares/uploadAvatar');


router.get('/test-users', Controllers.testUsers);
router.post('/add/:role/:parent?', checkAuth.auth, Controllers.createUsers);
router.get('/get-dashboard', checkAuth.auth ,Controllers.getUsersDashboard);
router.get('/get-children/:role/:parent', checkAuth.auth ,Controllers.getUsers);
router.put('/update/:id', checkAuth.auth ,Controllers.updateUsers);
router.delete('/delete/:id', checkAuth.auth ,Controllers.deleteUsers);
router.get('/get-godfathers', checkAuth.auth ,Controllers.getGodfathers);
router.get('/get-leaders/:parent', checkAuth.auth ,Controllers.getLeaders);
router.put('/update-parents/:id', checkAuth.auth, Controllers.updateParent);

//routes to upload and get avatars
router.post('/upload-avatar/:id', [checkAuth.auth, uploads.single('file0')] ,Controllers.uploadAvatar);
router.get('/get-avatar/:file', Controllers.getAvatar);


module.exports = router;