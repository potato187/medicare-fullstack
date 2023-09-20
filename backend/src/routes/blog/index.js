const express = require('express');
const { authMiddleware } = require('@/auth');
const { handlerValidateRequest, handlerParseParamsToArray } = require('@/middleware');
const { idSchema } = require('@/validations');
const { BlogController } = require('@/controllers');
const { updateSchema, querySchema, createSchema } = require('./schema');

const router = express.Router();

router.use(authMiddleware.authorization);
router.use(authMiddleware.checkRoles(['admin']));

router.get(
	'/',
	handlerParseParamsToArray(['sort']),
	handlerValidateRequest(querySchema, 'query'),
	BlogController.getByQueryParams,
);

router.get('/:id', handlerValidateRequest(idSchema, 'params'), BlogController.getOneById);

router.post('', handlerValidateRequest(createSchema), BlogController.createOne);

router.patch(
	'/:id',
	handlerValidateRequest(idSchema, 'params'),
	handlerValidateRequest(updateSchema),
	BlogController.updateOneById,
);

router.delete('/:id', handlerValidateRequest(idSchema, 'params'), BlogController.deleteOneById);

module.exports = router;
