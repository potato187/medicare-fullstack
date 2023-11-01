const { authMiddleware } = require('@/auth');
const { AccessController } = require('@/controllers');
const { validateRequest } = require('@/middleware');
const express = require('express');
const { signUpSchema, loginSchema, changePasswordSchema } = require('./schema');

const router = express.Router();

router.post('/login', validateRequest(loginSchema), AccessController.login);
router.get('/refresh-tokens/:id', AccessController.refreshTokens);

router.use(authMiddleware.authorization);

router.get('/logout', AccessController.logout);
router.post('/sign-up', validateRequest(signUpSchema), AccessController.signUp);
router.post('/change-password', validateRequest(changePasswordSchema), AccessController.changePassword);

module.exports = router;
