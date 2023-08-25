import { useEffect, useRef } from 'react';

export function useClickOutside(callback = () => {}) {
	const nodeRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (nodeRef.current && !nodeRef.current.contains(event.target)) {
				callback(event);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [callback]);

	return nodeRef;
}
