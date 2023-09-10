const codeReason = require('./status.core');

class SuccessResponse {
	constructor(code = 100200, metadata = {}) {
		this.code = code;
		this.status = 'success';
		this.message = codeReason[code];
		this.metadata = metadata;
	}

	send(res) {
		const statusCode = +this.code.toString().slice(-3);
		return res.status(statusCode).json({ ...this });
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
