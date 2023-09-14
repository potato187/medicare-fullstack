const { authMiddleware } = require('@/auth');
const { BlogCategoryController } = require('@/controllers');
const { handlerValidateRequest } = require('@/middleware');
const express = require('express');
const { idSchema } = require('@/validations');
const { createSchema, querySchema, deleteSchema, sortableSchema } = require('./schema');

const router = express.Router();

router.use(authMiddleware.authorization);
router.use(authMiddleware.checkRoles(['admin']));
router.get('/', handlerValidateRequest(querySchema, 'query'), BlogCategoryController.getAll);
router.post('/', handlerValidateRequest(createSchema), BlogCategoryController.createOne);
router.post('/sortable', handlerValidateRequest(sortableSchema), BlogCategoryController.sortable);
router.patch('/:id', handlerValidateRequest(idSchema, 'params'), BlogCategoryController.updateOneById);
router.post('/delete', handlerValidateRequest(deleteSchema), BlogCategoryController.deleteByIds);

module.exports = router;
