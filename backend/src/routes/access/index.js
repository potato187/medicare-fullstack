'use strict';
const { authMiddleware } = require('@/auth');
const { AccessController } = require('@/controllers');
const { handlerValidateRequest, tryCatch } = require('@/middleware');
const express = require('express');
const { signUpSchema, loginSchema } = require('./schema');

const router = express.Router();

router.post('/login', handlerValidateRequest(loginSchema), tryCatch(AccessController.login));
router.get('/refresh-tokens/:id', tryCatch(AccessController.refreshTokens));

router.use(authMiddleware.authorization);

router.get('/logout', tryCatch(AccessController.logout));
router.post('/sign-up', handlerValidateRequest(signUpSchema), tryCatch(AccessController.signUp));

module.exports = router;
