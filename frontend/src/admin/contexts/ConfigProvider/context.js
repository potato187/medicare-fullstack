import { createContext } from 'react';

export const THEME = {
	LIGHT: 'theme_light',
	DARK: 'theme_dark',
};

export const ConfigContext = createContext({
	theme: THEME.LIGHT,
	isFullScreen: false,
	toggleConfig: (f) => f,
});
