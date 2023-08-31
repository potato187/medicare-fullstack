'use strict';
const { BadRequestError } = require('@/core');

module.exports = (schema, type = 'body') => {
	return async (req, res, next) => {
		const { error, value } = await schema.validate(req[type], {
			errors: { label: 'key', wrap: { label: false } },
		});

		if (error) {
			console.log(error);
			return next(new BadRequestError({ code: 100400, message: error.details[0].message }));
		} else {
			req[type] = value;
		}
		return next();
	};
};
