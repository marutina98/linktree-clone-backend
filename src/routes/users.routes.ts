
// export {} fixes redeclaration error
// in a file without exports.

export {}

const express = require('express');
const router = express.Router();

const userController = require('./../controlllers/user.controllers');

router.get('/', userController.getUsers);
router.get('/:id', userController.getUser);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;