const express = require('express');
const { authMiddleware } = require('@/auth');
const { DoctorController } = require('@/controllers');
const { handlerValidateRequest, tryCatch, handlerParseParamsToArray } = require('@/middleware');
const { idSchema } = require('@/validations');
const { createSchema, updateSchema, importSchema, querySchema, getOneSchema, exportSchema } = require('./schema');

const router = express.Router();

router.use(authMiddleware.authorization);
router.use(authMiddleware.checkRoles(['admin']));

router.get(
	'/query',
	handlerParseParamsToArray(['sort']),
	handlerValidateRequest(querySchema, 'query'),
	tryCatch(DoctorController.getByQueryParams),
);

router.get(
	'/:id',
	handlerValidateRequest(idSchema, 'params'),
	handlerValidateRequest(getOneSchema, 'query'),
	tryCatch(DoctorController.getOne),
);

router.patch(
	'/:id',
	handlerValidateRequest(idSchema, 'params'),
	handlerValidateRequest(updateSchema),
	tryCatch(DoctorController.updateOne),
);

router.delete('/:id', handlerValidateRequest(idSchema, 'params'), tryCatch(DoctorController.deleteOne));

router.post('/', handlerValidateRequest(createSchema), tryCatch(DoctorController.createOne));

router.post(
	'/export',
	handlerParseParamsToArray(['sort'], 'body'),
	handlerValidateRequest(exportSchema),
	tryCatch(DoctorController.export),
);

router.post('/import', handlerValidateRequest(importSchema), tryCatch(DoctorController.insertMany));

module.exports = router;
