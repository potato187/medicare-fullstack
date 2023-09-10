const { authMiddleware } = require('@/auth');
const { AdminController } = require('@/controllers');
const { handlerValidateRequest, handlerParseParamsToArray } = require('@/middleware');
const express = require('express');
const { querySchema, updateSchema, paramsSchema } = require('./schema');

const router = express.Router();

router.use(authMiddleware.authorization);
router.use(authMiddleware.checkRoles(['admin']));

router.get(
	'/query',
	handlerParseParamsToArray(['sort']),
	handlerValidateRequest(querySchema, 'query'),
	AdminController.queryByParams,
);

router.delete('/delete/:id', handlerValidateRequest(paramsSchema, 'params'), AdminController.deleteOneById);

router.patch(
	'/update/:id',
	handlerValidateRequest(paramsSchema, 'params'),
	handlerValidateRequest(updateSchema),
	AdminController.updateOneById,
);

module.exports = router;
