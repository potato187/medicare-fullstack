'use strict';
const { ReasonPhrases, StatusCodes } = require('@/httpStatusCode');

class ErrorResponse extends Error {
	constructor(message, status) {
		super(message);
		this.status = status;
	}
}

class ForbiddenRequestError extends ErrorResponse {
	constructor(message = ReasonPhrases.FORBIDDEN, statusCode = StatusCodes.FORBIDDEN) {
		super(message, statusCode);
	}
}

class BadRequestError extends ErrorResponse {
	constructor(message = ReasonPhrases.BAD_REQUEST, statusCode = StatusCodes.BAD_REQUEST) {
		super(message, statusCode);
	}
}

class ConflictRequestError extends ErrorResponse {
	constructor(message = ReasonPhrases.CONFLICT, statusCode = StatusCodes.CONFLICT) {
		super(message, statusCode);
	}
}

class NotFoundRequestError extends ErrorResponse {
	constructor(message = ReasonPhrases.NOT_FOUND, statusCode = StatusCodes.NOT_FOUND) {
		super(message, statusCode);
	}
}

class InterServerRequestError extends ErrorResponse {
	constructor(message = ReasonPhrases.INTERNAL_SERVER_ERROR, statusCode = StatusCodes.INTERNAL_SERVER_ERROR) {
		super(message, statusCode);
	}
}

class UnauthorizedRequestError extends ErrorResponse {
	constructor(message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED) {
		super(message, statusCode);
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
