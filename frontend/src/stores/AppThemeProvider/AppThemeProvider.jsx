import { useEventListener, useIsomorphicLayoutEffect, useLocalStorage } from 'hooks';
import { useCallback, useMemo, useRef } from 'react';
import { ConfigContext, sidebarBreakPoint, sidebarStates, themes, devices } from './context';

export function AppThemeProvider({ children }) {
	const { mobile, desktop } = devices;
	const { open, close } = sidebarStates;
	const sidebarRef = useRef();

	const [theme, setTheme] = useLocalStorage('configs', {
		themeMode: themes.light,
	});

	const toggleSidebar = useCallback(() => {
		const { open, close } = sidebarStates;
		const newState = sidebarRef.current === open ? close : open;
		document.body.dataset.sidebar = newState;
		sidebarRef.current = newState;
	}, []);

	const contextValue = useMemo(
		() => ({
			theme,
			setTheme,
			toggleSidebar,
		}),
		[theme, setTheme, toggleSidebar],
	);

	const handleWindowResize = () => {
		const currentScreenWidth = window.innerWidth;

		if (currentScreenWidth > sidebarBreakPoint) {
			if (sidebarRef.current !== open) {
				document.body.dataset.sidebar = open;
				sidebarRef.current = open;
			}
			document.body.dataset.device = desktop;
		}

		if (currentScreenWidth < sidebarBreakPoint) {
			if (sidebarRef.current !== close) {
				document.body.dataset.sidebar = close;
				sidebarRef.current = close;
			}
			document.body.dataset.device = mobile;
		}
	};

	useIsomorphicLayoutEffect(() => {
		const { themeMode } = theme;
		document.body.dataset.theme = themeMode;
	}, [theme]);

	useIsomorphicLayoutEffect(() => {
		const isDesktop = window.innerWidth > sidebarBreakPoint;
		const state = isDesktop ? open : close;
		document.body.dataset.sidebar = state;
		document.body.dataset.device = isDesktop ? desktop : mobile;
		sidebarRef.current = state;
	}, []);

	useEventListener('resize', handleWindowResize);

	return <ConfigContext.Provider value={contextValue}>{children}</ConfigContext.Provider>;
}
