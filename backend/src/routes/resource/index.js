'use strict';
const { authMiddleware } = require('@/auth');
const { ResourceController } = require('@/controllers');
const { tryCatch, handlerValidateRequest } = require('@/middleware');
const express = require('express');
const { modelSchema, querySchema } = require('./schema');
const router = express.Router();

router.use(authMiddleware.authorization);
router.use(authMiddleware.checkRoles(['admin']));

router.get(
	'/:model',
	handlerValidateRequest(modelSchema, 'params'),
	handlerValidateRequest(querySchema, 'query'),
	tryCatch(ResourceController.getAll),
);

module.exports = router;
