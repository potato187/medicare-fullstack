'use strict';
const { authMiddleware } = require('@/auth');
const { SpecialtyController } = require('@/controllers');
const { tryCatch, handlerValidateRequest } = require('@/middleware');
const { idSchema } = require('@/validations');
const express = require('express');
const { createSchema, updateSchema } = require('./schema');
const router = express.Router();

router.use(authMiddleware.authorization);
router.use(authMiddleware.checkRoles(['admin']));

router.get('/:id', handlerValidateRequest(idSchema, 'params'), tryCatch(SpecialtyController.getOne));

router.get('/', tryCatch(SpecialtyController.getAll));

router.post('/', handlerValidateRequest(createSchema), tryCatch(SpecialtyController.createOne));

router.patch(
	'/:id',
	handlerValidateRequest(idSchema, 'params'),
	handlerValidateRequest(idSchema, updateSchema),
	tryCatch(SpecialtyController.updateOne),
);

router.delete('/:id', handlerValidateRequest(idSchema, 'params'), tryCatch(SpecialtyController.deleteOne));

module.exports = router;
