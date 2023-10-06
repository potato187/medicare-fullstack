import { useIsomorphicLayoutEffect, useLocalStorage } from 'admin/hooks';
import { useMemo } from 'react';
import { ConfigContext, THEME } from './context';

export function ConfigProvider({ children }) {
	const [configs, setConfigs] = useLocalStorage('configs', {
		theme: THEME.LIGHT,
	});

	const enterFullscreen = () => {
		const element = document.documentElement;
		if (element.requestFullscreen) {
			element.requestFullscreen();
		} else if (element.mozRequestFullScreen) {
			// Firefox
			element.mozRequestFullScreen();
		} else if (element.webkitRequestFullscreen) {
			// Chrome, Safari, and Opera
			element.webkitRequestFullscreen();
		} else if (element.msRequestFullscreen) {
			// IE/Edge
			element.msRequestFullscreen();
		}
	};

	const exitFullscreen = () => {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.mozCancelFullScreen) {
			// Firefox
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			// Chrome, Safari and Opera
			document.webkitExitFullscreen();
		} else if (document.msExitFullscreen) {
			// IE/Edge
			document.msExitFullscreen();
		}
	};

	useIsomorphicLayoutEffect(() => {
		const { theme } = configs;
		document.body.setAttribute('data-theme', theme);
	}, [configs]);

	const contextValue = useMemo(
		() => ({
			configs,
			setConfigs,
			enterFullscreen,
			exitFullscreen,
		}),
		[configs, setConfigs],
	);

	return <ConfigContext.Provider value={contextValue}>{children}</ConfigContext.Provider>;
}
