const codeReason = require('@/core/status.core');

module.exports = (error, req, res, next) => {
	// eslint-disable-next-line no-console
	console.log(error);
	if (error.name === 'MongoServerError') {
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
