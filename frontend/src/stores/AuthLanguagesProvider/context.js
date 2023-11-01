import { createContext } from 'react';

export const LANGUAGE_DEFAULT = 'en';

const LanguageContext = createContext({
	languages: {},
	validationForm: {},
	languageId: LANGUAGE_DEFAULT,
	changeLanguageById: () => null,
	updateLanguageL: () => null,
});

export default LanguageContext;
