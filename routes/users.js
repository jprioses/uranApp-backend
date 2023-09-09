const express = require('express');
const router = express.Router();
const Controllers = require('../controllers/users');
const checkAuth = require('../middlewares/auth')

router.get('/test-users', Controllers.testUsers);
router.post('/add-users/:role/:ref_parent?', checkAuth.auth, Controllers.postUser);
router.get('/get-users-dashboard', checkAuth.auth ,Controllers.getUsersDashboard);
router.get('/get-users/:role/:ref', checkAuth.auth ,Controllers.getUsers);
router.put('/update-users/:id', checkAuth.auth ,Controllers.putUser);
router.delete('/delete-users/:id', checkAuth.auth ,Controllers.deleteUser);
router.get('/get-godfathers', checkAuth.auth ,Controllers.getGodfathers);
router.get('/get-leaders/:ref', checkAuth.auth ,Controllers.getLeaders);
router.put('/update-refs/:id', checkAuth.auth, Controllers.updateParents);


module.exports = router;