'use strict';

module.exports = (req, res, next) => {
	return next(new NotFoundRequestError());
};
