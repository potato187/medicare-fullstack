import { createContext, useContext, useMemo, useState } from 'react';
import cn from 'classnames';

const tabsContext = createContext({
	tabIndex: 0,
	onSelect: () => null,
});

export const useTabs = () => {
	const context = useContext(tabsContext);
	if (!context) {
		throw new Error('The tabsContext must be used within in a TabsProvider');
	}
	return context;
};

export function Tabs({ className = 'tabs', tabIndexActive = 0, children }) {
	const [tabIndex, setTabIndex] = useState(tabIndexActive);

	const onSelect = (tabIndexActive) => {
		if (tabIndex !== tabIndexActive) {
			setTabIndex(tabIndexActive);
		}
	};

	const values = useMemo(
		() => ({
			tabIndexActive: tabIndex,
			onSelect,
		}),
		[tabIndex],
	);

	return (
		<tabsContext.Provider value={values}>
			<div className={cn(className)}>{children}</div>
		</tabsContext.Provider>
	);
}
