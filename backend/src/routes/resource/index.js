'use strict';
const { authMiddleware } = require('@/auth');
const { ResourceController } = require('@/controllers');
const { tryCatch } = require('@/middleware');
const express = require('express');
const router = express.Router();

router.use(authMiddleware.authorization);
router.use(authMiddleware.checkRoles(['admin']));

router.get('/gender', tryCatch(ResourceController.getAllGender));
router.get('/admin-role', tryCatch(ResourceController.getAllAdminRole));

module.exports = router;
