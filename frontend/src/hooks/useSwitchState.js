import { typeOf } from '@/utils';
import { useCallback, useState } from 'react';

export function useSwitchState(initialValue = false) {
	const [isOpen, setIsOpen] = useState(initialValue);

	const turnOff = useCallback(() => {
		setIsOpen(false);
	}, []);

	const turnOn = useCallback(() => {
		setIsOpen(true);
	}, []);

	const toggle = useCallback((newOpen) => {
		setIsOpen((prevState) => (typeOf(newOpen) === 'boolean' ? newOpen : !prevState));
	}, []);

	return { isOpen, turnOff, turnOn, toggle };
}
