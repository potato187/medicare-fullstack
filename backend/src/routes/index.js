'use strict';
const express = require('express');
const router = express.Router();

router.use('/auth', require('./access'));
router.use('/admin', require('./admin'));
router.use('/language', require('./language'));
router.use('/resource', require('./resource'));

module.exports = router;
