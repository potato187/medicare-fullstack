const { authMiddleware } = require('@/auth');
const { UPLOAD_FIELDS } = require('@/constant');
const { SettingConfigController } = require('@/controllers');
const { upload } = require('@/storage');
const express = require('express');

const router = express.Router();

router.use(authMiddleware.authorization);
router.use(authMiddleware.checkRoles(['admin']));

router.get('/', SettingConfigController.getConfig);
router.post('/', upload.fields(UPLOAD_FIELDS), SettingConfigController.updateConfig);

module.exports = router;
