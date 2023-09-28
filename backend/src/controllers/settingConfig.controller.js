/* eslint-disable no-unused-vars */
const { OkResponse } = require('@/core');
const { tryCatch } = require('@/middleware');
const { SettingConfigService } = require('@/services');

class SettingConfigController {
	getConfig = (req, res, next) => {
		new OkResponse({
			metadata: SettingConfigService.getConfig(),
		}).send(res);
	};

	updateConfig = (req, res, next) => {
		new OkResponse({
			metadata: SettingConfigService.updateConfig(req.body),
		}).send(res);
	};
}

module.exports = new SettingConfigController();
