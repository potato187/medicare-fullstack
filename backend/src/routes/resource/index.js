const { authMiddleware } = require('@/auth');
const { ResourceController } = require('@/controllers');
const { validateRequest } = require('@/middleware');
const express = require('express');
const { modelSchema, querySchema, blogSchema } = require('./schema');

const router = express.Router();

router.use(authMiddleware.authorization);
router.use(authMiddleware.checkRoles(['admin']));

router.get(
	'/:model',
	validateRequest(modelSchema, 'params'),
	validateRequest(querySchema, 'query'),
	ResourceController.getAll,
);

router.post(
	'/:model',
	validateRequest(modelSchema, 'params'),
	validateRequest(blogSchema),
	ResourceController.insertMany,
);

module.exports = router;
