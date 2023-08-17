'use strict';
const { BadRequestError } = require('@/core');

const handlerValidateRequest = (schema, requestType = 'body') => {
	return async (req, res, next) => {
		const { error } = await schema.validate(req[requestType], { errors: { label: 'key', wrap: { label: false } } });
		if (error) {
			return next(new BadRequestError(error.details[0].message));
		}
		return next();
	};
};

module.exports = handlerValidateRequest;
