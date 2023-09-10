const { authMiddleware } = require('@/auth');
const { PostCategoryController } = require('@/controllers');
const { tryCatch, handlerValidateRequest } = require('@/middleware');
const express = require('express');
const { idSchema } = require('@/validations');
const { createSchema } = require('./schema');

const router = express.Router();

router.use(authMiddleware.authorization);
router.use(authMiddleware.checkRoles(['admin']));

router.post('/', handlerValidateRequest(createSchema), tryCatch(PostCategoryController.createOne));
router.patch('/:id', handlerValidateRequest(idSchema, 'params'), tryCatch(PostCategoryController.updateOneById));
router.delete('/:id', handlerValidateRequest(idSchema, 'params'), tryCatch(PostCategoryController.deleteOneById));

module.exports = router;
