const express = require('express');
const router = express.Router();
const c = require('../user/userController');

router.get('/get_users', c.getUsers);
router.get('/get_pencapaian', c.getPencapaian);

module.exports = router;