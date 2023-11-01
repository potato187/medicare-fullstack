import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

export const useDocumentTitle = (title, deps = []) => {
	useIsomorphicLayoutEffect(() => {
		if (title) {
			window.document.title = title;
		}
	}, deps);
};
