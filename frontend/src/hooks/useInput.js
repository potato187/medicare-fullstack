import { useCallback, useState } from 'react';

export function useInput(initialValue) {
	const [value, setValue] = useState(initialValue);

	const onChange = useCallback((newValue) => {
		setValue(newValue);
	}, []);

	return [value, onChange];
}
