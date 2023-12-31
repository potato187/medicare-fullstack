const express = require('express');
const { authMiddleware } = require('@/auth');
const { DoctorController } = require('@/controllers');
const { validateRequest, processQueryParams } = require('@/middleware');
const { idSchema } = require('@/validations');
const { createSchema, updateSchema, importSchema, querySchema, getOneSchema, exportSchema } = require('./schema');

const router = express.Router();

router.use(authMiddleware.authorization);
router.use(authMiddleware.checkRoles(['admin', 'mod']));

router.get(
	'/query',
	processQueryParams(['sort']),
	validateRequest(querySchema, 'query'),
	DoctorController.getByQueryParams,
);

router.get(
	'/:id',
	validateRequest(idSchema, 'params'),
	validateRequest(getOneSchema, 'query'),
	DoctorController.getOne,
);

router.patch('/:id', validateRequest(idSchema, 'params'), validateRequest(updateSchema), DoctorController.updateOne);

router.delete('/:id', validateRequest(idSchema, 'params'), DoctorController.deleteOne);

router.post('/', validateRequest(createSchema), DoctorController.createOne);

router.post('/export', processQueryParams(['sort'], 'body'), validateRequest(exportSchema), DoctorController.export);

router.post('/import', validateRequest(importSchema), DoctorController.insertMany);

module.exports = router;
