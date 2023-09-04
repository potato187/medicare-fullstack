'use strict';
const express = require('express');
const { authMiddleware } = require('@/auth');
const { tryCatch } = require('@/middleware');
const { BookingController } = require('@/controllers');
const router = express.Router();

router.post('/', tryCatch(BookingController.createOne));

router.use(authMiddleware.authorization);
router.use(authMiddleware.checkRoles(['admin']));

router.patch('/:id', tryCatch(BookingController.updateOneById));
router.delete('/:id', tryCatch(BookingController.deleteOneById));

module.exports = router;
