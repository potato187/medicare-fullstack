/* eslint-disable max-classes-per-file */
const { ReasonPhrases, StatusCodes } = require('@/httpStatusCode');

class ErrorResponse extends Error {
	constructor(message, status, code = 100500) {
		super(message);
		this.status = status;
		this.code = code;
	}
}

class BadRequestError extends ErrorResponse {
	constructor(error = {}) {
		const { message = ReasonPhrases.BAD_REQUEST, status = StatusCodes.BAD_REQUEST, code = 100400 } = error;
		super(message, status, code);
	}
}

class ForbiddenRequestError extends ErrorResponse {
	constructor(error = {}) {
		const { message = ReasonPhrases.FORBIDDEN, status = StatusCodes.FORBIDDEN, code = 100403 } = error;
		super(message, status, code);
	}
}

class ConflictRequestError extends ErrorResponse {
	constructor(error = {}) {
		const { message = ReasonPhrases.CONFLICT, status = StatusCodes.CONFLICT, code = 100409 } = error;
		super(message, status, code);
	}
}

class NotFoundRequestError extends ErrorResponse {
	constructor(error = {}) {
		const { message = ReasonPhrases.NOT_FOUND, status = StatusCodes.NOT_FOUND, code = 100404 } = error;
		super(message, status, code);
	}
}

class InterServerRequestError extends ErrorResponse {
	constructor(error = {}) {
		const {
			message = ReasonPhrases.INTERNAL_SERVER_ERROR,
			status = StatusCodes.INTERNAL_SERVER_ERROR,
			code = 100500,
		} = error;
		super(message, status, code);
	}
}

class UnauthorizedRequestError extends ErrorResponse {
	constructor(error = {}) {
		const { message = ReasonPhrases.UNAUTHORIZED, status = StatusCodes.UNAUTHORIZED, code = 100401 } = error;
		super(message, status, code);
	}
}

module.exports = {
	ErrorResponse,
	NotFoundRequestError,
	ConflictRequestError,
	BadRequestError,
	ForbiddenRequestError,
	InterServerRequestError,
	UnauthorizedRequestError,
};
