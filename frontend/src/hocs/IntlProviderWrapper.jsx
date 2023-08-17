import '@formatjs/intl-pluralrules/locale-data/en';
import '@formatjs/intl-pluralrules/locale-data/vi';
import '@formatjs/intl-pluralrules/polyfill';

import { useLanguages } from '@/store';
import '@formatjs/intl-relativetimeformat/locale-data/en';
import '@formatjs/intl-relativetimeformat/locale-data/vi';
import '@formatjs/intl-relativetimeformat/polyfill';
import { IntlProvider } from 'react-intl';

export default function languageUtils({ children }) {
	const { languageId, languages } = useLanguages();

	return (
		<IntlProvider locale={languageId} messages={languages[languageId]} defaultLocale='en'>
			{children}
		</IntlProvider>
	);
}
