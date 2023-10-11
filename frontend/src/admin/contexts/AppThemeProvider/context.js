import { createContext } from 'react';

export const THEME = {
	LIGHT: 'theme_light',
	DARK: 'theme_dark',
};

export const ConfigContext = createContext({
	theme: { theme: THEME.LIGHT },
	setTheme: (f) => f,
});
