'use strict';
const { authMiddleware } = require('@/auth');
const { PostCategoryController } = require('@/controllers');
const { tryCatch, handlerValidateRequest } = require('@/middleware');
const express = require('express');
const { createSchema } = require('./schema');
const { idSchema } = require('@/validations');
const router = express.Router();

router.use(authMiddleware.authorization);
router.use(authMiddleware.checkRoles(['admin']));

router.post('/', handlerValidateRequest(createSchema), tryCatch(PostCategoryController.create));
router.patch('/:id', handlerValidateRequest(idSchema, 'params'), tryCatch(PostCategoryController.updateById));
router.delete('/:id', handlerValidateRequest(idSchema, 'params'), tryCatch(PostCategoryController.deleteById));

module.exports = router;
