const { authMiddleware } = require('@/auth');
const { LinkController } = require('@/controllers');
const { validateRequest } = require('@/middleware');
const express = require('express');
const { idSchema } = require('@/validations');
const { createSchema, sortableSchema, deleteMultiSchema, querySchema } = require('./schema');

const router = express.Router();

router.use(authMiddleware.authorization);
router.use(authMiddleware.checkRoles(['admin']));

router.get('/', validateRequest(querySchema, 'query'), LinkController.getAll);
router.get('/:id', validateRequest(idSchema, 'params'), LinkController.getOneById);

router.post('/', validateRequest(createSchema, 'body'), LinkController.createOne);
router.post('/delete', validateRequest(deleteMultiSchema, 'body'), LinkController.deleteByIds);

router.patch('/sortable', validateRequest(sortableSchema, 'body'), LinkController.sortable);
router.patch('/:id', validateRequest(idSchema, 'params'), LinkController.updateOneById);

module.exports = router;
