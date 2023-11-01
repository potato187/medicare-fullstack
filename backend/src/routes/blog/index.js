const express = require('express');
const { authMiddleware } = require('@/auth');
const { validateRequest, processQueryParams } = require('@/middleware');
const { idSchema } = require('@/validations');
const { BlogController } = require('@/controllers');
const { upload } = require('@/storage');
const { updateSchema, querySchema, createSchema } = require('./schema');

const router = express.Router();

router.use(authMiddleware.authorization);
router.use(authMiddleware.checkRoles(['admin', 'mod']));

router.get('/', processQueryParams(['sort']), validateRequest(querySchema, 'query'), BlogController.getByQueryParams);

router.get('/:id', validateRequest(idSchema, 'params'), BlogController.getOneById);

router.post('', upload.single('image[0]'), validateRequest(createSchema), BlogController.createOne);

router.patch(
	'/:id',
	validateRequest(idSchema, 'params'),
	upload.single('image[0]'),
	validateRequest(updateSchema),
	BlogController.updateOneById,
);

router.delete('/:id', validateRequest(idSchema, 'params'), BlogController.deleteOneById);

module.exports = router;
