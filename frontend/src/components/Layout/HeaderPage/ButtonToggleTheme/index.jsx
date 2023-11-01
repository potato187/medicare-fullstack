import { Button } from 'components/BaseUI';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { useTheme } from 'stores';

export function ButtonToggleTheme() {
	const { theme, toggleTheme } = useTheme();
	const isDarkTheme = theme === 'dark' ? 'on' : 'off';

	return (
		<Button info switched square rounded fade data-switch={isDarkTheme} onClick={toggleTheme}>
			<MdOutlineLightMode size='1.25em' />
			<MdOutlineDarkMode size='1.25em' />
		</Button>
	);
}
