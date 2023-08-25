import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

export function useToggle(initialValue = false) {
	const [value, setValue] = useState(initialValue);

	const toggleValue = useCallback(() => {
		setValue((prevValue) => {
			return !prevValue;
		});
	}, []);

	return [value, toggleValue, setValue];
}

useToggle.propTypes = {
	initialValue: PropTypes.bool,
};
