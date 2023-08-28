'use strict';
const { authMiddleware } = require('@/auth');
const { ResourceController } = require('@/controllers');
const { tryCatch, handlerValidateRequest } = require('@/middleware');
const express = require('express');
const { modelSchema, querySchema, postSchema } = require('./schema');
const router = express.Router();

router.use(authMiddleware.authorization);
router.use(authMiddleware.checkRoles(['admin']));

router.get(
	'/:model',
	handlerValidateRequest(modelSchema, 'params'),
	handlerValidateRequest(querySchema, 'query'),
	tryCatch(ResourceController.getAll),
);

router.post(
	'/:model',
	handlerValidateRequest(modelSchema, 'params'),
	handlerValidateRequest(postSchema),
	tryCatch(ResourceController.insertMany),
);

module.exports = router;
