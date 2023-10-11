import { useContext } from 'react';
import { typeOf } from 'utils';
import { ConfigContext } from './context';

export const useTheme = () => {
	const context = useContext(ConfigContext);
	if (typeOf(context) === 'undefined') {
		throw new Error('useConfig must be used within a ConfigProvider');
	}

	return context;
};
