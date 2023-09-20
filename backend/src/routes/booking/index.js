const express = require('express');
const { authMiddleware } = require('@/auth');
const { handlerValidateRequest, handlerParseParamsToArray } = require('@/middleware');
const { BookingController } = require('@/controllers');
const { idSchema } = require('@/validations');
const { createSchema, updateSchema, querySchema } = require('./schema');

const router = express.Router();

router.post('/', handlerValidateRequest(createSchema), BookingController.createOne);

router.use(authMiddleware.authorization);
router.use(authMiddleware.checkRoles(['admin']));

router.get(
	'/query',
	handlerParseParamsToArray(['sort']),
	handlerValidateRequest(querySchema, 'query'),
	BookingController.getByQueryParams,
);

router.patch(
	'/:id',
	handlerValidateRequest(idSchema, 'params'),
	handlerValidateRequest(updateSchema),
	BookingController.updateOneById,
);

router.delete('/:id', handlerValidateRequest(idSchema), BookingController.deleteOneById);

module.exports = router;
