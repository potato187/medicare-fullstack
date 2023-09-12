const { authMiddleware } = require('@/auth');
const { PostCategoryController } = require('@/controllers');
const { handlerValidateRequest } = require('@/middleware');
const express = require('express');
const { idSchema } = require('@/validations');
const { createSchema, querySchema } = require('./schema');

const router = express.Router();

router.use(authMiddleware.authorization);
router.use(authMiddleware.checkRoles(['admin']));
router.get('/', handlerValidateRequest(querySchema, 'params'), PostCategoryController.getAll);
router.post('/', handlerValidateRequest(createSchema), PostCategoryController.createOne);
router.post('/sortable', PostCategoryController.sortable);
router.patch('/:id', handlerValidateRequest(idSchema, 'params'), PostCategoryController.updateOneById);
router.post('/delete', PostCategoryController.deleteByIds);

module.exports = router;
