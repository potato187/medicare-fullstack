import { useIsomorphicLayoutEffect } from '@dnd-kit/utilities';
import { useCallback, useRef } from 'react';

export const useEventCallback = (fn) => {
	const ref = useRef(() => {
		throw new Error('Cannot call an event handler while rendering.');
	});

	useIsomorphicLayoutEffect(() => {
		ref.current = fn;
	}, [fn]);

	return useCallback((...args) => ref.current?.(...args), []);
};
