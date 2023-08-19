'use strict';
const { authMiddleware } = require('@/auth');
const { AccessController } = require('@/controllers');
const { handlerValidateRequest, tryCatch } = require('@/middleware');
const express = require('express');
const { signUpSchema, loginSchema, refreshTokenSchema } = require('./schema.validation');

const router = express.Router();

router.post('/sign-up', handlerValidateRequest(signUpSchema), tryCatch(AccessController.signUp));
router.post('/login', handlerValidateRequest(loginSchema), tryCatch(AccessController.login));

router.use(authMiddleware.authorization);
router.post('/logout', tryCatch(AccessController.logout));

router.post(
	'/refresh-token',
	handlerValidateRequest(refreshTokenSchema),
	tryCatch(AccessController.handleRefreshToken),
);

module.exports = router;
