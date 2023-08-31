'use strict';
const { NotFoundRequestError } = require('@/core');
const fs = require('fs');
const path = require('path');

const LANGUAGE_PATH = '../json/languages/dashboard';
const ACCEPTED_LANGUAGES = ['en', 'vi'];

class LanguageService {
	static getById(languageId) {
		const filePath = path.join(__dirname, LANGUAGE_PATH, `${languageId}.json`);
		if (!fs.existsSync(filePath)) {
			throw NotFoundRequestError();
		}

		const fileContent = fs.readFileSync(filePath, 'utf-8');
		return JSON.parse(fileContent);
	}

	static getAll() {
		const languageFiles = ACCEPTED_LANGUAGES.reduce((obj, language) => {
			const filePath = path.join(__dirname, LANGUAGE_PATH, `${language}.json`);
			const fileContent = fs.readFileSync(filePath, 'utf-8');
			const parsedContent = JSON.parse(fileContent);
			obj[language] = parsedContent;
			return obj;
		}, {});

		return languageFiles;
	}

	static updateById({ languageId, bodyUpdate }) {
		const filePath = path.join(__dirname, LANGUAGE_PATH, `${languageId}.json`);
		if (!fs.existsSync(filePath)) {
			throw new NotFoundRequestError();
		}
	
		fs.writeFileSync(filePath, JSON.stringify(bodyUpdate));
		return bodyUpdate;
	}
}

module.exports = LanguageService;
