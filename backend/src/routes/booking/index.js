'use strict';
const express = require('express');
const { authMiddleware } = require('@/auth');
const { tryCatch, handlerValidateRequest, handlerParseParamsToArray } = require('@/middleware');
const { BookingController } = require('@/controllers');
const { bookingSchema, updateBookingSchema, queryBookingSchema } = require('./schema');
const { idSchema } = require('@/validations');
const router = express.Router();

router.post('/', handlerValidateRequest(bookingSchema), tryCatch(BookingController.createOne));

router.use(authMiddleware.authorization);
router.use(authMiddleware.checkRoles(['admin']));

router.get(
	'/query',
	handlerParseParamsToArray(['sort']),
	handlerValidateRequest(queryBookingSchema, 'query'),
	tryCatch(BookingController.queryByParams),
);

router.patch(
	'/:id',
	handlerValidateRequest(idSchema, 'params'),
	handlerValidateRequest(updateBookingSchema),
	tryCatch(BookingController.updateOneById),
);
router.delete('/:id', handlerValidateRequest(idSchema), tryCatch(BookingController.deleteOneById));

module.exports = router;
