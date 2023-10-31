import { Button } from 'components/BaseUI';
import produce from 'immer';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { themes, useTheme } from 'stores';

export function ButtonToggleTheme() {
	const { theme, setTheme } = useTheme();
	const { themeMode } = theme;
	const { light, dark } = themes;
	const isDarkTheme = themeMode === dark ? 'on' : 'off';

	const handleToggleTheme = () => {
		setTheme(
			produce((draft) => {
				draft.themeMode = draft.themeMode === light ? dark : light;
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
