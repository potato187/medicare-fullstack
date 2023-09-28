const path = require('path');
const fs = require('fs');

class SettingConfigService {
	static PATH_FILE = '../json/modules/setting.config.json';

	static getConfig() {
		const filePath = path.join(__dirname, SettingConfigService.PATH_FILE);

		const fileContent = fs.readFileSync(filePath, 'utf-8');

		return JSON.parse(fileContent);
	}

	static updateConfig(bodyUpdate) {
		const filePath = path.join(__dirname, SettingConfigService.PATH_FILE);

		fs.writeFileSync(filePath, JSON.stringify(bodyUpdate));

		return bodyUpdate;
	}
}

module.exports = SettingConfigService;
