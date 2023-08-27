'use strict';
const express = require('express');
const router = express.Router();

router.use('/admin', require('./admin'));
router.use('/auth', require('./access'));
router.use('/language', require('./language'));
router.use('/resource', require('./resource'));
router.use('/specialty', require('./specialty'));

module.exports = router;
