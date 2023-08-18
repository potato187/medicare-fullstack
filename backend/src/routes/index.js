'use strict';
const express = require('express');
const router = express.Router();

router.use('/auth', require('./access'));
router.use('/language', require('./language'));
router.use('/admin', require('./admin'));

module.exports = router;
