const express = require('express');
const router = express.Router();
const Controllers = require('../controllers/comments');
const checkAuth = require('../middlewares/auth')

router.get('/get/:user', checkAuth.auth ,Controllers.getComments);
router.post('/add/:user', checkAuth.auth ,Controllers.addComments);
router.put('/update/:id', checkAuth.auth ,Controllers.updateComments);
router.delete('/delete/:id', checkAuth.auth ,Controllers.deleteComments);


module.exports = router;