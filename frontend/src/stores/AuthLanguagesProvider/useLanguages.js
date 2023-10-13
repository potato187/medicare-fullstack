import { useContext } from 'react';
import LanguageContext from './context';

export default function useLanguages() {
	const context = useContext(LanguageContext);
	if (!context) {
		throw new Error('useLanguages must be used within a a AuthLanguagesProvider');
	}

	return context;
}
