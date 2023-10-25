/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const codeReason = require('@/core/status.core');

const errorNames = ['MongoServerError', 'MulterError'];

module.exports = (error, req, res, next) => {
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
