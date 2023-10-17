import { useEventListener } from 'hooks';
import { useRef, useState } from 'react';
import module from './style.module.scss';

export function ButtonToggleSidebar() {
	const buttonRef = useRef(null);
	const [active, setActive] = useState('open');

	const { 'btn-toggle': btnToggleCln, 'btn-toggle__wrapper': btnToggleWrapperCln } = module;

	const handleToggleSidebar = () => {
		const state = active === 'open' ? 'close' : 'open';
		buttonRef.current.classList.toggle('active', state === 'close');
		document.body.dataset.sidebar = state;
		setActive(state);
	};

	useEventListener('click', handleToggleSidebar, buttonRef);

	return (
		<button type='button' className={btnToggleCln} ref={buttonRef}>
			<span className={btnToggleWrapperCln}>
				<span />
				<span />
				<span />
			</span>
		</button>
	);
}
