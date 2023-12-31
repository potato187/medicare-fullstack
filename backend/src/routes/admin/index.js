const express = require('express');
const { authMiddleware } = require('@/auth');
const { AdminController } = require('@/controllers');
const { validateRequest, processQueryParams } = require('@/middleware');
const { idSchema } = require('@/validations');
const { querySchema, updateSchema, getOneSchema } = require('./schema');

const router = express.Router();

router.use(authMiddleware.authorization);
router.use(authMiddleware.checkRoles(['admin', 'mod']));

router.get(
	'/query',
	processQueryParams(['sort']),
	validateRequest(querySchema, 'query'),
	AdminController.getByQueryParams,
);

router.get('/:id', validateRequest(getOneSchema, 'query'), AdminController.getOneById);

router.patch(
	'/update/:id',
	validateRequest(idSchema, 'params'),
	validateRequest(updateSchema),
	AdminController.updateOneById,
);

router.use(authMiddleware.checkRoles(['admin']));
router.delete('/delete/:id', validateRequest(idSchema, 'params'), AdminController.deleteOneById);

module.exports = router;
