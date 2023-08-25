import cn from 'classnames';
import { useEffect, useRef } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { CSSTransition } from 'react-transition-group';
import './transition.scss';
import { FormattedMessage } from 'react-intl';
import { useClickOutside } from 'hooks';
import { BasePortal } from '../BasePortal';
import module from './style.module.scss';

export function BaseModal({
	selectorId = 'modal',
	className,
	size = 'md',
	isOpen = false,
	backdrop = true,
	keyboard = false,
	onClose = () => {},
	children,
}) {
	const {
		modal: modalCln,
		'modal--sm': modalSmCln,
		'modal--md': modalMdCln,
		'modal--lg': modalLgCln,
		'modal--xl': modalXlCln,
		'modal-dialog': dialogCln,
		'modal-static': modalStaticCln,
	} = module;

	const styles = cn(
		modalCln,
		{
			[modalSmCln]: size === 'sm',
			[modalMdCln]: size === 'md',
			[modalLgCln]: size === 'lg',
			[modalXlCln]: size === 'xl',
		},
		className,
	);

	const nodeRef = useRef(null);

	const dialogRef = useClickOutside(() => {
		if (keyboard && !backdrop) {
			onClose();
		}
		if (!keyboard && backdrop && nodeRef.current) {
			nodeRef.current.classList.add(modalStaticCln);
			setTimeout(() => {
				if (nodeRef.current) {
					nodeRef.current.classList.remove(modalStaticCln);
				}
			}, 300);
		}
	});

	useEffect(() => {
		const closeOnEscapeKey = (e) => {
			if (e.key === 'Escape' || e.keyCode === 27) {
				onClose();
			}
		};

		if (keyboard) {
			document.addEventListener('keydown', closeOnEscapeKey);
		}
		return () => {
			document.removeEventListener('keydown', closeOnEscapeKey);
		};
	}, [keyboard, onClose]);

	return (
		<BasePortal wrapperId={selectorId}>
			<CSSTransition in={isOpen} nodeRef={nodeRef} timeout={300} classNames='modal' unmountOnExit>
				<div className={styles} ref={nodeRef}>
					<div className={dialogCln} ref={dialogRef}>
						{children}
					</div>
				</div>
			</CSSTransition>
		</BasePortal>
	);
}

export function BaseModalHeader({ idIntl = '', className, onClose = null }) {
	const {
		'modal-header': modalHeaderClass,
		'modal-header__title': titleClass,
		'modal-btn--close': btnCloseClass,
	} = module;
	return (
		<div className={cn(modalHeaderClass, className)}>
			<h2 className={titleClass}>{idIntl ? <FormattedMessage id={idIntl} /> : null}</h2>
			<button type='button' onClick={onClose} className={btnCloseClass}>
				<AiOutlineClose size='1.5em' />
			</button>
		</div>
	);
}

export function BaseModalBody({ as: Component = 'div', className, children, ...props }) {
	const { 'modal-body': modalBodyClass } = module;
	return (
		<Component className={cn(modalBodyClass, className)} {...props}>
			{children}
		</Component>
	);
}

export function BaseModalFooter({ className, children }) {
	const { 'modal-footer': modalFooterClass } = module;
	return <div className={cn(modalFooterClass, className)}>{children}</div>;
}
