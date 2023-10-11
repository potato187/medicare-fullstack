import { useClickOutside } from 'admin/hooks';
import cn from 'classnames';
import { useRef } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { FormattedMessage } from 'react-intl';
import { CSSTransition } from 'react-transition-group';
import { BasePortal } from '../BasePortal';
import module from './style.module.scss';
import './transition.scss';

export function BaseModal({
	selectorId = 'modal',
	className,
	size = 'md',
	isOpen = false,
	backdrop = true,
	keyboard = false,
	children,
	onClose = () => false,
}) {
	const dialogRef = useRef(null);
	const nodeRef = useRef(null);

	const {
		modal: modalCln,
		'modal--sm': modalSmCln,
		'modal--md': modalMdCln,
		'modal--lg': modalLgCln,
		'modal--xl': modalXlCln,
		'modal-dialog': dialogCln,
		'modal-static': modalStaticCln,
	} = module;

	const classNames = cn(
		modalCln,
		{
			[modalSmCln]: size === 'sm',
			[modalMdCln]: size === 'md',
			[modalLgCln]: size === 'lg',
			[modalXlCln]: size === 'xl',
		},
		className,
	);

	const handleClickOutSide = () => {
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
	};

	useClickOutside(dialogRef, handleClickOutSide);

	return (
		<BasePortal wrapperId={selectorId}>
			<CSSTransition in={isOpen} nodeRef={nodeRef} timeout={300} classNames='modal' unmountOnExit>
				<div className={classNames} ref={nodeRef}>
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
	const classNames = cn(modalHeaderClass, className);

	return (
		<div className={classNames}>
			<h2 className={titleClass}>{idIntl ? <FormattedMessage id={idIntl} /> : null}</h2>
			<button type='button' onClick={onClose} className={btnCloseClass}>
				<AiOutlineClose size='1.5em' />
			</button>
		</div>
	);
}

export function BaseModalBody({ as: Component = 'div', className, children, ...props }) {
	const styles = cn(module['modal-body'], className);

	return (
		<Component className={styles} {...props}>
			{children}
		</Component>
	);
}

export function BaseModalFooter({ className, children }) {
	const { 'modal-footer': modalFooterClass } = module;
	return <div className={cn(modalFooterClass, className)}>{children}</div>;
}
