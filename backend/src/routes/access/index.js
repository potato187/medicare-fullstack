'use strict';
const { handlerValidateRequest, tryCatch } = require('@/middleware');
const express = require('express');
const { signUpSchema, loginSchema } = require('./schema.validation');
const { AccessController } = require('@/controllers');
const { authMiddleware } = require('@/auth');

const router = express.Router();

router.post('/sign-up', handlerValidateRequest(signUpSchema), tryCatch(AccessController.signUp));
router.post('/login', handlerValidateRequest(loginSchema), tryCatch(AccessController.login));

router.use(tryCatch(authMiddleware.authorization));
router.post('/logout', tryCatch(AccessController.logout));

router.use(tryCatch(authMiddleware.permission(['read'])));

module.exports = router;
