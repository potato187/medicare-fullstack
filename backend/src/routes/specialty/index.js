'use strict';
const { authMiddleware } = require('@/auth');
const { SpecialtyController } = require('@/controllers');
const { tryCatch } = require('@/middleware');
const express = require('express');
const router = express.Router();

router.use(authMiddleware.authorization);
router.use(authMiddleware.checkRoles(['admin']));

router.get('/:id', tryCatch(SpecialtyController.getOne));

router.get('/', tryCatch(SpecialtyController.getAll));

router.post('/', tryCatch(SpecialtyController.createOne));

router.patch('/:id', tryCatch(SpecialtyController.updateOne));

router.delete('/:id', tryCatch(SpecialtyController.deleteOne));

module.exports = router;
