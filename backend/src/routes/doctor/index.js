'use strict';
const express = require('express');
const { authMiddleware } = require('@/auth');
const { DoctorController } = require('@/controllers');
const { handlerValidateRequest, tryCatch, handlerParseParamsToArray } = require('@/middleware');
const { createSchema, updateSchema, importSchema, querySchema } = require('./schema');
const { idSchema } = require('@/validations');
const router = express.Router();

router.use(authMiddleware.authorization);
router.use(authMiddleware.checkRoles(['admin']));

router.get(
	'/',
	handlerParseParamsToArray(['sort']),
	handlerValidateRequest(querySchema, 'query'),
	tryCatch(DoctorController.queryByParams),
);

router.post('/', handlerValidateRequest(createSchema), tryCatch(DoctorController.createOne));

router.post('/import', handlerValidateRequest(importSchema), tryCatch(DoctorController.insertMany));

router.patch(
	'/:id',
	handlerValidateRequest(idSchema, 'params'),
	handlerValidateRequest(updateSchema),
	tryCatch(DoctorController.updateOne),
);

router.delete(
	'/:id',
	handlerValidateRequest(idSchema, 'params'),
	handlerValidateRequest(updateSchema),
	tryCatch(DoctorController.deleteOne),
);

module.exports = router;
