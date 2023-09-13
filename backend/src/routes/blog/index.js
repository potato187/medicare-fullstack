const express = require('express');
const { authMiddleware } = require('@/auth');
const { handlerValidateRequest } = require('@/middleware');
const { idSchema } = require('@/validations');
const { blogController } = require('@/controllers');
const { updateSchema, querySchema, createSchema } = require('./schema');

const router = express.Router();

router.use(authMiddleware.authorization);
router.use(authMiddleware.checkRoles(['admin']));

router.get('/', handlerValidateRequest(querySchema), blogController.queryByParams);

router.get('/:id', handlerValidateRequest(idSchema, 'params'), blogController.getOneById);

router.post('', handlerValidateRequest(createSchema), blogController.createOne);

router.patch(
	'/:id',
	handlerValidateRequest(idSchema, 'params'),
	handlerValidateRequest(updateSchema),
	blogController.updateOneById,
);

router.delete('/:id', handlerValidateRequest(idSchema, 'params'), blogController.deleteOneById);

module.exports = router;
