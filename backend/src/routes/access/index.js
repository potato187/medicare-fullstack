const { authMiddleware } = require('@/auth');
const { AccessController } = require('@/controllers');
const { validateRequest } = require('@/middleware');
const express = require('express');
const { signUpSchema, loginSchema } = require('./schema');

const router = express.Router();

router.post('/login', validateRequest(loginSchema), AccessController.login);
router.get('/refresh-tokens/:id', AccessController.refreshTokens);

router.use(authMiddleware.authorization);

router.get('/logout', AccessController.logout);
router.post('/sign-up', validateRequest(signUpSchema), AccessController.signUp);

module.exports = router;
