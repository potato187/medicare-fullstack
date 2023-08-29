'use strict';
const { authMiddleware } = require('@/auth');
const { AdminController } = require('@/controllers');
const { tryCatch, handlerValidateRequest, handlerParseParamsToArray } = require('@/middleware');
const express = require('express');
const { querySchema, updateSchema, paramsSchema } = require('./schema');
const router = express.Router();

router.use(authMiddleware.authorization);
router.use(authMiddleware.checkRoles(['admin']));

router.get(
	'/query',
	handlerParseParamsToArray(['sort']),
	handlerValidateRequest(querySchema, 'query'),
	tryCatch(AdminController.query),
);

router.delete('/delete/:id', handlerValidateRequest(paramsSchema, 'params'), tryCatch(AdminController.deleteAdminById));

router.patch(
	'/update/:id',
	handlerValidateRequest(paramsSchema, 'params'),
	handlerValidateRequest(updateSchema),
	tryCatch(AdminController.updateAdminById),
);

module.exports = router;
