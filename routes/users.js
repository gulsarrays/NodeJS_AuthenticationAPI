const express = require('express');
const router = express.Router();

const UserController = require('../controllers/userController');
const auth = require('../middlewares/auth');

router.post('/create', UserController.create);
router.put('/reset', auth, UserController.reset);
router.delete('/forgot', auth, UserController.forgot);

module.exports = router;
