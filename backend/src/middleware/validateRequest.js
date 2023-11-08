const { BadRequestError } = require('@/core');
const { logEventHelper } = require('@/helpers');
const tryCatch = require('./tryCatch');

module.exports = (schema, type = 'body') => {
	return tryCatch(async (req, res, next) => {
		const { error, value } = await schema.validate(req[type], {
			errors: { label: 'key', wrap: { label: false } },
		});

		if (error) {
			const { message } = error.details[0];
			const codeNumber = !Number.isNaN(Number(message)) ? +message : 100400;
			logEventHelper(req, JSON.stringify(error.details));
			throw new BadRequestError({ code: codeNumber });
		}

		req[type] = value;

		next();
	});
};
