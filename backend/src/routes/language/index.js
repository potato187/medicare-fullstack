'use strict';
const { LanguageController } = require('@/controllers');
const { authMiddleware } = require('@/auth');
const { tryCatch } = require('@/middleware');
const express = require('express');
const router = express.Router();

router.get('', tryCatch(LanguageController.getAll));
router.get('/:id', tryCatch(LanguageController.getById));

router.use(authMiddleware.authorization);
router.use(authMiddleware.checkRoles(['admin']));

router.put('/:id', tryCatch(LanguageController.updateById));

module.exports = router;
