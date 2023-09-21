const { authMiddleware } = require('@/auth');
const { SpecialtyController } = require('@/controllers');
const { validateRequest } = require('@/middleware');
const { idSchema } = require('@/validations');
const express = require('express');
const { createSchema, updateSchema } = require('./schema');

const router = express.Router();

router.use(authMiddleware.authorization);
router.use(authMiddleware.checkRoles(['admin']));

router.get('/:id', validateRequest(idSchema, 'params'), SpecialtyController.getOne);

router.get('/', SpecialtyController.getAll);

router.post('/', validateRequest(createSchema), SpecialtyController.createOne);

router.patch(
	'/:id',
	validateRequest(idSchema, 'params'),
	validateRequest(idSchema, updateSchema),
	SpecialtyController.updateOne,
);

router.delete('/:id', validateRequest(idSchema, 'params'), SpecialtyController.deleteOne);

module.exports = router;
