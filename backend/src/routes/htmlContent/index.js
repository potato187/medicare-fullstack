const express = require('express');
const { authMiddleware } = require('@/auth');
const { handlerParseParamsToArray, handlerValidateRequest } = require('@/middleware');
const { HtmlContentController } = require('@/controllers');
const { idSchema } = require('@/validations');
const { createSchema, querySchema, updateSchema } = require('./schema');

const router = express.Router();

router.use(authMiddleware.authorization);
router.use(authMiddleware.checkRoles(['admin']));

router.get(
	'/',
	handlerParseParamsToArray(['sort']),
	handlerValidateRequest(querySchema),
	HtmlContentController.getByQueryParams,
);

router.get(
	'/:id',
	handlerValidateRequest(idSchema, 'params'),
	handlerValidateRequest(querySchema),
	HtmlContentController.getById,
);

router.post('/', handlerValidateRequest(createSchema), HtmlContentController.createOne);

router.patch(
	'/:id',
	handlerValidateRequest(idSchema, 'params'),
	handlerValidateRequest(updateSchema),
	HtmlContentController.UpdateOneById,
);

router.patch('/:id', handlerValidateRequest(idSchema, 'params'), HtmlContentController.deleteOneById);

module.exports = router;
