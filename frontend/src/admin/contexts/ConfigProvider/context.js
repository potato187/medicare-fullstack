import { createContext } from 'react';

export const THEME = {
	LIGHT: 'theme_light',
	DARK: 'theme_dark',
};

export const ConfigContext = createContext({
	configs: { theme: THEME.LIGHT },
	setConfigs: (f) => f,
	enterFullscreen: (f) => f,
	exitFullscreen: (f) => f,
});
