import { createWrapperAndAppendToBody } from '@/utils';
import { useEffect, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export function BasePortal({ children, selectorId = 'portal-root' }) {
	const [container, setContainer] = useState(null);

	useEffect(() => {
		let wrapperElement = document.getElementById(selectorId);
		let systemCreated = false;
		if (!wrapperElement) {
			systemCreated = true;
			wrapperElement = createWrapperAndAppendToBody(selectorId);
		}
		setContainer(wrapperElement);

		return () => {
			if (systemCreated && wrapperElement.parentNode) {
				wrapperElement.parentNode.removeChild(wrapperElement);
			}
		};
	}, [selectorId]);

	return container && createPortal(children, container);
}
