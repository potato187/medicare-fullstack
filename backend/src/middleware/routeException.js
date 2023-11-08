const { NotFoundRequestError } = require('@/core');

module.exports = (req, res, next) => {
	next(new NotFoundRequestError({ code: 101404 }));
};
