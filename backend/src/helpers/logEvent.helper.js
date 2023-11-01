const fs = require('fs').promises;
const path = require('path');

const fileName = path.join(__dirname, '../../logs', 'logs.log');

const logEventHelper = async (req, msg) => {
	try {
		const dateTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
		const contentLog = `${dateTime} -- ${req.originalUrl} -- ${req.method} -- ${msg}.\n`;
		fs.appendFile(fileName, contentLog);
	} catch (error) {
		// eslint-disable-next-line no-console
	}
};

module.exports = logEventHelper;
