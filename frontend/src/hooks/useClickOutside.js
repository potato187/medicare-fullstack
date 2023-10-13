import { el } from 'date-fns/locale';
import { useEventListener } from './useEventListener';

export const useClickOutside = (ref, handler, mouseEvent = 'mousedown') => {
	useEventListener(mouseEvent, (event) => {
		const element = ref?.current;

		if (!element || element.contains(event.target)) {
			return false;
		}

		handler();
		return true;
	});
};
