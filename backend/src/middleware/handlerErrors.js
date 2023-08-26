'use strict';
const codeReason = require('@/core/status.core');

module.exports = (error, req, res, next) => {
	console.log(error);
	const statusCode = error.status || 500;
	const code = error.code || 100500;

	return res.status(statusCode).json({
		status: 'error',
		code,
		message: codeReason[code],
	});
};
