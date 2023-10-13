import { languageApi } from 'api';
import { Preloader } from 'components/Loader';
import { changeLanguage } from 'reduxStores/slices/auth';
import { buildValidationForm } from 'admin/validators';
import { useAuth } from 'hooks';
import produce from 'immer';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { flattenMessages, tryCatch } from 'utils';
import LanguageContext, { LANGUAGE_DEFAULT } from './context';

export default function AuthLanguagesProvider({ children }) {
	const { info } = useAuth();
	const [languages, setLanguages] = useState(null);
	const [validationForm, setValidationForm] = useState({});
	const dispatch = useDispatch();

	const changeLanguageById = useCallback(
		(languageId) => {
			dispatch(changeLanguage({ languageId }));
		},
		[dispatch],
	);

	const updateLanguage = useCallback((languageId, language) => {
		setLanguages(
			produce((draft) => {
				draft[languageId] = flattenMessages(language);
			}),
		);
	}, []);

	const values = useMemo(() => {
		return {
			languages,
			validationForm,
			languageId: info.languageId || LANGUAGE_DEFAULT,
			changeLanguageById,
			updateLanguage,
		};
	}, [languages, changeLanguageById, updateLanguage, validationForm, info.languageId]);

	useEffect(() => {
		const fetchAllLanguages = async () => {
			const { metadata } = await languageApi.getLanguages();

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
		return <Preloader />;
	}

	return <LanguageContext.Provider value={values}>{children}</LanguageContext.Provider>;
}
