const express = require('express');
const { authMiddleware } = require('@/auth');
const { tryCatch, handlerValidateRequest, handlerParseParamsToArray } = require('@/middleware');
const { BookingController } = require('@/controllers');
const { idSchema } = require('@/validations');
const { createSchema, updateSchema, querySchema } = require('./schema');

const router = express.Router();

router.post('/', handlerValidateRequest(createSchema), tryCatch(BookingController.createOne));

router.use(authMiddleware.authorization);
router.use(authMiddleware.checkRoles(['admin']));

router.get(
	'/query',
	handlerParseParamsToArray(['sort']),
	handlerValidateRequest(querySchema, 'query'),
	tryCatch(BookingController.queryByParams),
);

router.patch(
	'/:id',
	handlerValidateRequest(idSchema, 'params'),
	handlerValidateRequest(updateSchema),
	tryCatch(BookingController.updateOneById),
);

router.delete('/:id', handlerValidateRequest(idSchema), tryCatch(BookingController.deleteOneById));

module.exports = router;
