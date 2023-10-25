import '@formatjs/intl-pluralrules/locale-data/en';
import '@formatjs/intl-pluralrules/locale-data/vi';
import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-relativetimeformat/locale-data/en';
import '@formatjs/intl-relativetimeformat/locale-data/vi';
import '@formatjs/intl-relativetimeformat/polyfill';
import { IntlProvider } from 'react-intl';
import { useLanguages } from 'stores';

export default function LanguageUtils({ children }) {
	const { languageId, languages } = useLanguages();

	return (
		<IntlProvider locale={languageId} messages={languages[languageId]} defaultLocale='en'>
			{children}
		</IntlProvider>
	);
}
