const { authMiddleware } = require('@/auth');
const { ResourceController } = require('@/controllers');
const { handlerValidateRequest } = require('@/middleware');
const express = require('express');
const { modelSchema, querySchema, blogSchema } = require('./schema');

const router = express.Router();

router.use(authMiddleware.authorization);
router.use(authMiddleware.checkRoles(['admin']));

router.get(
	'/:model',
	handlerValidateRequest(modelSchema, 'params'),
	handlerValidateRequest(querySchema, 'query'),
	ResourceController.getAll,
);

router.post(
	'/:model',
	handlerValidateRequest(modelSchema, 'params'),
	handlerValidateRequest(blogSchema),
	ResourceController.insertMany,
);

module.exports = router;
