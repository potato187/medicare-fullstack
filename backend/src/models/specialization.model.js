const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Specialization';

const specializationSchema = new Schema({
	name: {
		vi: {},
		en: {},
	},
	description: {},
});

const Specialization = model(DOCUMENT_NAME, specializationSchema);

module.exports = Specialization;
