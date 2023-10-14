import { Button } from 'components/BaseUI';
import produce from 'immer';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { THEME, useTheme } from 'stores';

export function ButtonToggleTheme() {
	const { theme, setTheme } = useTheme();
	const { themeMode } = theme;
	const isDarkTheme = themeMode === THEME.DARK ? 'on' : 'off';

	const handleToggleTheme = () => {
		setTheme(
			produce((draft) => {
				draft.themeMode = draft.themeMode === THEME.LIGHT ? THEME.DARK : THEME.LIGHT;
			}),
		);
	};

	return (
		<Button info switched square rounded fade data-switch={isDarkTheme} onClick={handleToggleTheme}>
			<MdOutlineLightMode size='1.25em' />
			<MdOutlineDarkMode size='1.25em' />
		</Button>
	);
}
