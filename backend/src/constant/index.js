const headerConstants = require('./header.constant');
const mongodbConstants = require('./mongodb.constant');
const languagesConstants = require('./languages.constant');

module.exports = {
	...headerConstants,
	...mongodbConstants,
	...languagesConstants,
};
