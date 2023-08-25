import { useCallback, useState } from 'react';
import { typeOf } from 'utils';

export function useSwitchState(initialValue = false) {
	const [isOpen, setIsOpen] = useState(initialValue);

	const turnOff = useCallback(() => {
		setIsOpen(false);
	}, []);

	const turnOn = useCallback(() => {
		setIsOpen(true);
	}, []);

	const toggle = useCallback((newOpen) => {
		setIsOpen((prevState) => {
			return typeOf(newOpen) === 'boolean' ? newOpen : !prevState;
		});
	}, []);

	return {
		isOpen,
		turnOff,
		turnOn,
		toggle,
	};
}
