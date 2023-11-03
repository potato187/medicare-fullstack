/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const codeReason = require('@/core/status.core');
const { logEventHelper } = require('@/helpers');

const errorNames = ['MongoServerError', 'MulterError'];

module.exports = (error, req, res, next) => {
	logEventHelper(req, error.message);
	console.log(error);
	if (errorNames.includes(error.name)) {
		return res.status(400).json({
			status: 'error',
			code: error.code,
			message: codeReason[100400],
		});
	}

	const statusCode = error.status || 500;
	const code = error.code || 100500;

	return res.status(statusCode).json({
		status: 'error',
		code,
		message: codeReason[code],
	});
};
