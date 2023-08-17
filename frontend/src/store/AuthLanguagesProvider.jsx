import { languageApi } from '@/admin/api';
import { changeLanguage } from '@/admin/redux/slices/authSlice';
import { buildValidationForm } from '@/admin/validation';
import { useAuth } from '@/hooks';
import { tryCatch } from '@/shared/utils';
import { flattenMessages } from '@/utils';
import produce from 'immer';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const LANGUAGE_DEFAULT = 'en';

const LanguageContext = createContext({
	languages: {},
	validationForm: {},
	languageId: LANGUAGE_DEFAULT,
	changeLanguageById: () => null,
	updateLanguageL: () => null,
});

export const useLanguages = () => {
	const context = useContext(LanguageContext);
	if (!context) {
		throw new Error('useLanguages must be used within a a AuthLanguagesProvider');
	}

	return context;
};

export function AuthLanguagesProvider({ children }) {
	const auth = useAuth();
	const [languages, setLanguages] = useState(null);
	const [validationForm, setValidationForm] = useState({});
	const dispatch = useDispatch();

	const changeLanguageById = useCallback((languageId) => {
		dispatch(changeLanguage({ languageId }));
	}, []);

	const updateLanguage = useCallback((languageId, language) => {
		setLanguages(
			produce((draft) => {
				draft[languageId] = flattenMessages(language);
			}),
		);
	}, []);

	useEffect(() => {
		const fetchAllLanguages = async () => {
			const metadata = await languageApi.getLanguages();
			const response = Object.keys(metadata).reduce((obj, languageId) => {
				obj[languageId] = flattenMessages(metadata[languageId]);
				return obj;
			}, {});

			setLanguages(response);
			setValidationForm(buildValidationForm(metadata[LANGUAGE_DEFAULT]));
		};

		tryCatch(fetchAllLanguages)();
	}, []);

	if (!languages) {
		return <div>loading 123</div>;
	}

	return (
		<LanguageContext.Provider
			value={{
				languages,
				validationForm,
				languageId: auth.languageId || LANGUAGE_DEFAULT,
				changeLanguageById,
				updateLanguage,
			}}>
			{children}
		</LanguageContext.Provider>
	);
}
