import { useAuth, useEventListener, useIsomorphicLayoutEffect } from 'hooks';
import { useCallback, useMemo, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { toggleTheme } from 'reduxStores/slices/auth';
import { ConfigContext, devices, sidebarBreakPoint, sidebarStates } from './context';

export function AppThemeProvider({ children }) {
	const { theme } = useAuth().info;
	const sidebarRef = useRef();
	const dispatch = useDispatch();
	const { mobile, desktop } = devices;
	const { open, close } = sidebarStates;

	const toggleSidebar = useCallback(() => {
		const { open, close } = sidebarStates;
		const newState = sidebarRef.current === open ? close : open;
		document.body.dataset.sidebar = newState;
		sidebarRef.current = newState;
	}, []);

	const contextValue = useMemo(
		() => ({
			theme,
			toggleTheme: () => dispatch(toggleTheme()),
			toggleSidebar,
		}),
		[dispatch, theme, toggleSidebar],
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
		document.body.dataset.theme = `theme_${theme}`;
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
