const { authMiddleware } = require('@/auth');
const { AdminController } = require('@/controllers');
const { validateRequest, processQueryParams } = require('@/middleware');
const express = require('express');
const { querySchema, updateSchema, paramsSchema } = require('./schema');

const router = express.Router();

router.use(authMiddleware.authorization);
router.use(authMiddleware.checkRoles(['admin']));

router.get(
	'/query',
	processQueryParams(['sort']),
	validateRequest(querySchema, 'query'),
	AdminController.getByQueryParams,
);

router.delete('/delete/:id', validateRequest(paramsSchema, 'params'), AdminController.deleteOneById);

router.patch(
	'/update/:id',
	validateRequest(paramsSchema, 'params'),
	validateRequest(updateSchema),
	AdminController.updateOneById,
);

module.exports = router;
