'use strict';
const { NotFoundRequestError } = require('@/core');

module.exports = (req, res, next) => {
	return next(NotFoundRequestError(`Not found:: ${req.originalUrl}`));
};
