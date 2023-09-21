const express = require('express');
const { authMiddleware } = require('@/auth');
const { validateRequest, processQueryParams } = require('@/middleware');
const { idSchema } = require('@/validations');
const { BlogController } = require('@/controllers');
const { updateSchema, querySchema, createSchema } = require('./schema');

const router = express.Router();

router.use(authMiddleware.authorization);
router.use(authMiddleware.checkRoles(['admin']));

router.get('/', processQueryParams(['sort']), validateRequest(querySchema, 'query'), BlogController.getByQueryParams);

router.get('/:id', validateRequest(idSchema, 'params'), BlogController.getOneById);

router.post('', validateRequest(createSchema), BlogController.createOne);

router.patch('/:id', validateRequest(idSchema, 'params'), validateRequest(updateSchema), BlogController.updateOneById);

router.delete('/:id', validateRequest(idSchema, 'params'), BlogController.deleteOneById);

module.exports = router;
