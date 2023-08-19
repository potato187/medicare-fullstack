'use strict';
const { authMiddleware } = require('@/auth');
const { AdminController } = require('@/controllers');
const { tryCatch, handlerValidateRequest, handlerParseParamsToArray } = require('@/middleware');
const express = require('express');
const { querySchema } = require('./schema.validation');
const router = express.Router();

router.use(authMiddleware.authorization);
router.use(authMiddleware.checkRoles(['admin']));

router.get(
	'/query',
	handlerParseParamsToArray(['sort']),
	handlerValidateRequest(querySchema, 'query'),
	tryCatch(AdminController.query),
);

router.get('/get-total-pages', tryCatch(AdminController.getTotalPages));

module.exports = router;
