import { useIsomorphicLayoutEffect, useLocalStorage } from 'admin/hooks';
import { useMemo } from 'react';
import { ConfigContext, THEME } from './context';

export function AppThemeProvider({ children }) {
	const [theme, setTheme] = useLocalStorage('configs', {
		themeMode: THEME.LIGHT,
	});

	useIsomorphicLayoutEffect(() => {
		const { themeMode } = theme;
		document.body.setAttribute('data-theme', themeMode);
	}, [theme]);

	const contextValue = useMemo(
		() => ({
			theme,
			setTheme,
		}),
		[theme, setTheme],
	);

	return <ConfigContext.Provider value={contextValue}>{children}</ConfigContext.Provider>;
}
