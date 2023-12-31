/* eslint-disable no-unused-vars */
const { OkResponse } = require('@/core');
const { SettingConfigService } = require('@/services');

class SettingConfigController {
	getConfig = (req, res, next) => {
		new OkResponse({
			metadata: SettingConfigService.getConfig(),
		}).send(res);
	};

	updateConfig = (req, res, next) => {
		new OkResponse({
			code: 703200,
			metadata: SettingConfigService.updateConfig({
				files: req.files,
				body: req.body,
			}),
		}).send(res);
	};
}

module.exports = new SettingConfigController();
