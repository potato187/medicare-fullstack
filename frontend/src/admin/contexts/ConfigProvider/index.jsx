import { useMemo, useState } from 'react';
import { ConfigContext } from './context';

export function ConfigProvider({ children }) {
	const [configs, setConfigs] = useState();

	const contextValue = useMemo(
		() => ({
			configs,
			setConfigs,
		}),
		[configs],
	);

	return <ConfigContext.Provider value={contextValue}>{children}</ConfigContext.Provider>;
}
