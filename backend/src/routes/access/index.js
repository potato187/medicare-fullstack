'use strict';
const { validateRequest, tryCatch } = require('@/middleware');
const express = require('express');
const { signUpSchema, loginSchema } = require('./schema.validation');
const { AccessController } = require('@/controllers');

const router = express.Router();

router.post('/sign-up', validateRequest({ schema: signUpSchema }), tryCatch(AccessController.signUp));
router.post('/login', validateRequest({ schema: loginSchema }), tryCatch(AccessController.login));

module.exports = router;
