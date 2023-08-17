'use strict';
const express = require('express');

const router = express.Router();

router.use('/auth', require('./access'));
router.use('/language', require('./language'));

module.exports = router;
