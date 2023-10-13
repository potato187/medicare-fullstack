import { useClickOutside, useEventListener, useIsFirstRender } from 'hooks';
import cn from 'classnames';
import React, { createContext, useCallback, useContext, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { BasePortal } from '../BasePortal';

const DropdownContext = createContext({
	headerRef: { current: null },
	isOpen: false,
	setToggle: (f) => f,
});

export const useDropdown = () => {
	const context = useContext(DropdownContext);
	if (!context) {
		throw new Error('The useDropdown must be used within a a DropdownProvider');
	}
	return context;
};

function DropdownProvider({ className, children, ...props }) {
	const headerRef = useRef(null);
	const [isOpen, setIsOpen] = useState(false);
	const classNames = cn('dropdown', className);

	const setToggle = useCallback((newState) => {
		setIsOpen(newState);
	}, []);

	const values = useMemo(() => {
		return {
			isOpen,
			headerRef,
			setToggle,
		};
	}, [isOpen, setToggle]);

	return (
		<DropdownContext.Provider value={values} {...props}>
			<div className={classNames}>{children}</div>
		</DropdownContext.Provider>
	);
}

export function BaseDropdown({ className, children, ...props }) {
	return (
		<DropdownProvider className={className} {...props}>
			{children}
		</DropdownProvider>
	);
}

export function DropdownHeader({ className = '', children, ...props }) {
	const { isOpen, setToggle, headerRef } = useDropdown();

	const styles = cn({
		'dropdown-toggle': true,
		show: isOpen,
		[className]: true,
	});

	return (
		<div className={styles} onClick={() => setToggle(true)} aria-hidden='true' ref={headerRef} {...props}>
			{children}
		</div>
	);
}

export function DropdownBody({ className = '', selectorId = 'portal-dropdown', children }) {
	const isFirst = useIsFirstRender();
	const nodeRef = useRef(null);
	const { headerRef, isOpen, setToggle } = useDropdown();
	const [coords, setCoords] = useState({
		top: 0,
		left: 0,
		minWidth: 0,
	});

	const handleClickOutside = () => {
		setToggle(false);
	};

	const updateCoords = useCallback(() => {
		if (headerRef.current && nodeRef.current) {
			const idContainer = headerRef.current.dataset.parent ?? 'root';
			const container = document.getElementById(idContainer);

			const containerRect = container.getBoundingClientRect();
			const headerRect = headerRef.current.getBoundingClientRect();
			const headerHeight = headerRect.height;
			const listRect = nodeRef.current.getBoundingClientRect();

			const spaceAbove = listRect.top - headerHeight - containerRect.top;
			const spaceBelow = containerRect.bottom - listRect.bottom;

			const newCoords = {
				left: headerRect.left,
				minWidth: headerRect.right - headerRect.left,
			};

			if (spaceBelow < listRect.height && spaceAbove > listRect.height + headerHeight + 8) {
				newCoords.top = headerRect.top - listRect.height - 8;
			} else {
				newCoords.top = headerRect.top + headerRect.height;
			}

			setCoords(newCoords);
		}
	}, [headerRef, nodeRef]);

	useLayoutEffect(() => {
		if (!isFirst) {
			updateCoords();
		}
	}, [isFirst, isOpen, updateCoords]);

	useClickOutside(nodeRef, handleClickOutside);
	useEventListener('scroll', updateCoords);
	useEventListener('resize', updateCoords);

	return (
		<BasePortal selectorId={selectorId}>
			<CSSTransition in={isOpen} timeout={300} classNames='dropdown-menu' unmountOnExit nodeRef={nodeRef}>
				<div
					className={cn(className)}
					ref={nodeRef}
					style={{
						position: 'fixed',
						...coords,
					}}
				>
					{children}
				</div>
			</CSSTransition>
		</BasePortal>
	);
}

export function DropdownItem({ type = 'div', customOnClick, children, ...props }) {
	const { setToggle } = useDropdown();

	const onClick = () => {
		if (customOnClick) {
			customOnClick();
		}
		setToggle(false);
	};

	return React.createElement(type, { ...props, onClick }, children);
}
