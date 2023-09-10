const { BadRequestError } = require('@/core');

module.exports =
	(schema, type = 'body') =>
	async (req, res, next) => {
		const { error, value } = await schema.validate(req[type], {
			errors: { label: 'key', wrap: { label: false } },
		});

		if (error) {
			return next(new BadRequestError({ code: 100400, message: error.details[0].message }));
		}

		req[type] = value;

		return next();
	};
