import { languageApi } from 'admin/api';
import { buildValidationForm } from 'admin/validation';
import { useAuth } from 'hooks';
import produce from 'immer';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { tryCatch } from 'admin/utilities';
import { flattenMessages } from 'utils';
import { changeLanguage } from 'admin/redux/slices/auth';
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
		return <div>loading 123</div>;
	}

	return <LanguageContext.Provider value={values}>{children}</LanguageContext.Provider>;
}
