const { authMiddleware } = require('@/auth');
const { LanguageController } = require('@/controllers');
const express = require('express');

const router = express.Router();

router.get('', LanguageController.getAll);
router.get('/:id', LanguageController.getById);

router.use(authMiddleware.authorization);
router.use(authMiddleware.checkRoles(['admin']));

router.put('/:id', LanguageController.updateById);

module.exports = router;
