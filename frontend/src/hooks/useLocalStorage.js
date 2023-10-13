/* eslint-disable no-console */
import { useCallback, useEffect, useState } from 'react';
import { parseJSON } from 'utils';
import { typeOf } from 'utils/repos';
import { useEventCallback } from './useEventCallback';
import { useEventListener } from './useEventListener';

export const useLocalStorage = (key, initialValue) => {
	const readValue = useCallback(() => {
		if (typeOf(window) === 'undefined') {
			return initialValue;
		}

		try {
			const valueJson = window.localStorage.getItem(key);
			return valueJson ? parseJSON(valueJson) : initialValue;
		} catch (error) {
			console.warn(`Error reading localStorage key “${key}”:`, error);
			return initialValue;
		}
	}, [key, initialValue]);

	const [storedValue, setStoredValue] = useState(readValue);

	const setValue = useEventCallback((value) => {
		if (typeOf(window) === 'undefined') {
			console.warn(`Tried setting localStorage key “${key}” even though environment is not a client`);
		}
		try {
			const newValue = value instanceof Function ? value(storedValue) : value;
			window.localStorage.setItem(key, JSON.stringify(newValue));
			window.dispatchEvent(new Event('local-storage'));
		} catch (error) {
			console.warn(`Error setting localStorage key “${key}”:`, error);
		}
	});

	const handleStorageChange = useCallback(
		(event) => {
			if (event instanceof StorageEvent && event.key && event.key !== key) {
				return;
			}
			setStoredValue(readValue());
		},
		[key, readValue],
	);

	useEffect(() => {
		setStoredValue(readValue());
	}, []);

	useEventListener('storage', handleStorageChange);
	useEventListener('local-storage', handleStorageChange);

	return [storedValue, setValue];
};
