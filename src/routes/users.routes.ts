const express = require('express');
const router = express.Router();

const userController = require('./../controlllers/user.controllers');

router.get('/', userController.getUsers);
router.get('/:id', userController.getUser);

module.exports = router;