const express = require('express');

const router = express.Router();

router.use('/admin', require('./admin'));
router.use('/auth', require('./access'));
router.use('/doctor', require('./doctor'));
router.use('/language', require('./language'));
router.use('/resource', require('./resource'));
router.use('/specialty', require('./specialty'));
router.use('/booking', require('./booking'));
router.use('/post-category', require('./postCategory'));
router.use('/blog', require('./blog'));

module.exports = router;
