'use strict';

const getTotalPages = async (model) => {
	return await model.count();
};

module.exports = {
	getTotalPages,
};
