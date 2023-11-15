const fs = require('fs').promises;
const path = require('path');

const fileName = path.join(__dirname, '../../logs', 'actions.log');

const logActionHandler = async (req, res, next) => {
	try {
		const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
		const dateTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
		const contentLog = `${dateTime} -- clientIP: ${clientIp}  -- method::${req.method} -  path::${
			req.originalUrl
		}  -- body::${JSON.stringify(req.body)}\n`;
		fs.appendFile(fileName, contentLog);
	} catch (error) {
		// eslint-disable-next-line no-console
	}

	next();
};

module.exports = logActionHandler;
