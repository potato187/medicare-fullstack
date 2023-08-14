'use strict';
const Joi = require('joi');

const textAlphaValidator = Joi.string().alphanum().required();
const textValidator = Joi.string().required();

const emailValidator = Joi.string().email({ minDomainSegments: 1, tlds: { allow: ['com'] } });

const passwordValidator = Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).message({
	'string.pattern.base': 'Password must be a strong password.',
});

module.exports = {
	textAlphaValidator,
	textValidator,
	emailValidator,
	passwordValidator,
};
