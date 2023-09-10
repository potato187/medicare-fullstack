const errorCore = require('./error.core');
const successCore = require('./success.core');

module.exports = {
	...errorCore,
	...successCore,
};
