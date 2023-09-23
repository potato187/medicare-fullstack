const express = require('express');
const { authMiddleware } = require('@/auth');
const { processQueryParams, validateRequest } = require('@/middleware');
const { HtmlContentController } = require('@/controllers');
const { idSchema } = require('@/validations');
const { createSchema, querySchema, updateSchema } = require('./schema');

const router = express.Router();

router.use(authMiddleware.authorization);
router.use(authMiddleware.checkRoles(['admin']));

router.get('/configs', HtmlContentController.getConfigs);

router.get(
	'/',
	processQueryParams(['sort', 'select']),
	validateRequest(querySchema, 'query'),
	HtmlContentController.getByQueryParams,
);

router.get('/:id', validateRequest(idSchema, 'params'), HtmlContentController.getById);

router.post('/', validateRequest(createSchema), HtmlContentController.createOne);

router.patch(
	'/:id',
	validateRequest(idSchema, 'params'),
	validateRequest(updateSchema),
	HtmlContentController.UpdateOneById,
);

router.delete('/:id', validateRequest(idSchema, 'params'), HtmlContentController.deleteOneById);

module.exports = router;
