
// export {} fixes redeclaration error
// in a file without exports.

export {}

const express = require('express');
const router = express.Router();

const profileController = require('./../controlllers/profile.controllers');

router.put('/:userId', profileController.updateProfile);

module.exports = router;