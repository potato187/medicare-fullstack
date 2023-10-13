import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

export const useDocumentTitle = (title, deps = []) => {
	useIsomorphicLayoutEffect(() => {
		window.document.title = title;
	}, deps);
};
