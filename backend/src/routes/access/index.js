const { authMiddleware } = require('@/auth');
const { AccessController } = require('@/controllers');
const { handlerValidateRequest } = require('@/middleware');
const express = require('express');
const { signUpSchema, loginSchema } = require('./schema');

const router = express.Router();

router.post('/login', handlerValidateRequest(loginSchema), AccessController.login);
router.get('/refresh-tokens/:id', AccessController.refreshTokens);

router.use(authMiddleware.authorization);

router.get('/logout', AccessController.logout);
router.post('/sign-up', handlerValidateRequest(signUpSchema), AccessController.signUp);

module.exports = router;
