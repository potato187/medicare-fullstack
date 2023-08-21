'use strict';
const codeReason = require('./status.core');

class SuccessResponse {
	constructor(code = 100200, metadata = {}) {
		this.code = code;
		this.status = 'success';
		this.message = codeReason[code];
		this.metadata = metadata;
	}

	send(req, res, headers = {}) {
		const { accessToken = null, refreshToken = null } = req.tokens || {};

		if (accessToken && refreshToken) {
			headers.accessToken = accessToken;
			headers.refreshToken = refreshToken;
		}

		const statusCode = +this.code.toString().slice(-3);
		return res.status(statusCode).json({ ...this, headers });
	}
}
class OkResponse extends SuccessResponse {
	constructor({ code = 100200, metadata }) {
		super(code, metadata);
	}
}

class CreatedResponse extends SuccessResponse {
	constructor({ code = 100201, metadata }) {
		super(code, metadata);
	}
}

module.exports = {
	OkResponse,
	CreatedResponse,
};
