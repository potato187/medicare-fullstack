import { useTheme } from 'stores';
import module from './style.module.scss';

export function ButtonToggleSidebar() {
	const { toggleSidebar } = useTheme();
	const { 'btn-toggle': btnToggleCln, 'btn-toggle__wrapper': btnToggleWrapperCln } = module;

	return (
		<button type='button' className={btnToggleCln} onClick={toggleSidebar}>
			<span className={btnToggleWrapperCln}>
				<span />
				<span />
				<span />
			</span>
		</button>
	);
}
