const path = require('path');
const fs = require('fs');

const getProperties = (string) => {
	return string
		.replace(/\[\d+\]/g, '')
		.split(/\[|\]/)
		.filter(Boolean);
};

class SettingConfigService {
	static PATH_FILE = '../json/modules/setting.config.json';

	static PATH_UPLOAD = 'public/uploads/web';

	static getConfig() {
		const filePath = path.join(__dirname, SettingConfigService.PATH_FILE);

		const fileContent = fs.readFileSync(filePath, 'utf-8');

		return JSON.parse(fileContent);
	}

	static updateConfig({ files, body }) {
		const filePath = path.join(__dirname, SettingConfigService.PATH_FILE);

		const keys = Object.keys(files);
		if (keys.length) {
			keys.forEach((key) => {
				let cloneObj = body;
				const { path: oldPath, originalname } = files[key][0];
				const newPath = path.join(SettingConfigService.PATH_UPLOAD, originalname);

				const properties = getProperties(key);
				while (properties.length > 1) {
					const k = properties.shift();
					cloneObj = cloneObj[k];
				}

				cloneObj.value = newPath;

				if (!fs.existsSync(newPath)) {
					fs.renameSync(oldPath, newPath);
				}
			});
		}

		fs.writeFileSync(filePath, JSON.stringify(body));

		return body;
	}
}

module.exports = SettingConfigService;
