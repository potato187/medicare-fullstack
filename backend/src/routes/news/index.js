const express = require('express');
const { authMiddleware } = require('@/auth');
const newsController = require('@/controllers/news.controller');
const { validateRequest, processQueryParams } = require('@/middleware');
const { idSchema } = require('@/validations');
const { querySchema, getOneSchema, createSchema, updateSchema } = require('./schema');

const router = express.Router();

router.use(authMiddleware.authorization);
router.use(authMiddleware.checkRoles(['admin']));

router.get(
	'/get/:id',
	validateRequest(idSchema, 'params'),
	validateRequest(getOneSchema, 'query'),
	newsController.getOneById,
);

router.get('/config', newsController.getConfig);

router.get(
	'/query',
	processQueryParams(['sort']),
	validateRequest(querySchema, 'query'),
	newsController.getByQueryParams,
);

router.post('/', validateRequest(createSchema), newsController.createOne);

router.patch('/:id', validateRequest(idSchema, 'params'), validateRequest(updateSchema), newsController.updateOneById);

router.delete('/:id', validateRequest(idSchema, 'params'), newsController.deleteOneById);

module.exports = router;
