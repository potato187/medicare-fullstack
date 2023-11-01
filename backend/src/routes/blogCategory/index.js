const { authMiddleware } = require('@/auth');
const { BlogCategoryController } = require('@/controllers');
const { validateRequest } = require('@/middleware');
const express = require('express');
const { idSchema } = require('@/validations');
const { createSchema, querySchema, deleteSchema, sortableSchema } = require('./schema');

const router = express.Router();

router.use(authMiddleware.authorization);
router.use(authMiddleware.checkRoles(['admin', 'mod']));

router.get('/', validateRequest(querySchema, 'query'), BlogCategoryController.getAll);
router.get('/flatten-blog-categories', validateRequest(querySchema, 'query'), BlogCategoryController.getFlattenAll);

router.post('/', validateRequest(createSchema), BlogCategoryController.createOne);
router.post('/sortable', validateRequest(sortableSchema), BlogCategoryController.sortable);
router.post('/delete', validateRequest(deleteSchema), BlogCategoryController.deleteByIds);

router.patch('/:id', validateRequest(idSchema, 'params'), BlogCategoryController.updateOneById);

module.exports = router;
