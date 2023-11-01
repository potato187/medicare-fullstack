const express = require('express');
const { authMiddleware } = require('@/auth');
const { validateRequest, processQueryParams } = require('@/middleware');
const { BookingController } = require('@/controllers');
const { idSchema } = require('@/validations');
const { createSchema, updateSchema, querySchema } = require('./schema');

const router = express.Router();

router.post('/', validateRequest(createSchema), BookingController.createOne);

router.use(authMiddleware.authorization);
router.use(authMiddleware.checkRoles(['admin', 'mod']));

router.get(
	'/query',
	processQueryParams(['sort']),
	validateRequest(querySchema, 'query'),
	BookingController.getByQueryParams,
);

router.get('/:id', validateRequest(idSchema, 'params'), BookingController.getOneById);

router.patch(
	'/:id',
	validateRequest(idSchema, 'params'),
	validateRequest(updateSchema),
	BookingController.updateOneById,
);

router.delete('/:id', validateRequest(idSchema), BookingController.deleteOneById);

module.exports = router;
