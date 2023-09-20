const { authMiddleware } = require('@/auth');
const { SpecialtyController } = require('@/controllers');
const { handlerValidateRequest } = require('@/middleware');
const { idSchema } = require('@/validations');
const express = require('express');
const { createSchema, updateSchema } = require('./schema');

const router = express.Router();

router.use(authMiddleware.authorization);
router.use(authMiddleware.checkRoles(['admin']));

router.get('/:id', handlerValidateRequest(idSchema, 'params'), SpecialtyController.getOne);

router.get('/', SpecialtyController.getAll);

router.post('/', handlerValidateRequest(createSchema), SpecialtyController.createOne);

router.patch(
	'/:id',
	handlerValidateRequest(idSchema, 'params'),
	handlerValidateRequest(idSchema, updateSchema),
	SpecialtyController.updateOne,
);

router.delete('/:id', handlerValidateRequest(idSchema, 'params'), SpecialtyController.deleteOne);

module.exports = router;
