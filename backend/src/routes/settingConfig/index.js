const { authMiddleware } = require('@/auth');
const { SettingConfigController } = require('@/controllers');
const express = require('express');

const router = express.Router();

router.use(authMiddleware.authorization);
router.use(authMiddleware.checkRoles(['admin']));

router.get('/', SettingConfigController.getConfig);
router.patch('/', SettingConfigController.updateConfig);

module.exports = router;
