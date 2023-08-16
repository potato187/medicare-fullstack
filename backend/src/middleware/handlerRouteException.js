'use strict';
const { NotFoundRequestError } = require('@/core');

module.exports = (req, res, next) => {
	return next(new NotFoundRequestError(`Not found:: ${req.originalUrl}`));
};
