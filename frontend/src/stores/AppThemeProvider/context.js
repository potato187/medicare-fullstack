import { createContext } from 'react';

export const sidebarBreakPoint = 1200;

export const themes = {
	light: 'theme_light',
	dark: 'theme_dark',
};

export const sidebarStates = {
	close: 'close',
	open: 'open',
};

export const devices = {
	mobile: 'mobile',
	desktop: 'desktop',
};

export const ConfigContext = createContext({
	theme: { theme: themes.light },
	setTheme: (f) => f,
	toggleSidebar: () => sidebarStates.open,
});
