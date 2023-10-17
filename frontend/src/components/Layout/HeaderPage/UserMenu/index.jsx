import cn from 'classnames';
import { Divider, DropdownItem } from 'components/BaseUI';
import { PATH_IMAGES } from 'constant';
import { useAuth, useClickOutside, useToggle } from 'hooks';
import { useRef } from 'react';
import { AiOutlineSetting } from 'react-icons/ai';
import { MdLogout } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { authLogout } from 'reduxStores/slices/auth';
import module from './style.module.scss';

export function UserMenu() {
	const navigate = useNavigate();
	const { info, tokens } = useAuth();
	const nodeRef = useRef(null);
	const [isOpen, toggle] = useToggle();
	const { firstName, lastName, email } = info;
	const fullName = `${lastName} ${firstName}`;
	const dispatch = useDispatch();
	const {
		dropdown: dropdownCln,
		dropdown__header: dropdownHeaderCln,
		dropdown__list: dropdownListCln,
		avatar: avatarCln,
		profile: profileCln,
		name: nameCln,
		email: emailCln,
	} = module;

	const handleLogout = () => {
		dispatch(
			authLogout({
				id: info.id,
				tokens: { accessToken: `Bear ${tokens.accessToken}`, refreshToken: tokens.refreshToken },
			}),
		);
	};

	const handleRedirect = () => {
		navigate('./personal/profile_setting');
		toggle();
	};

	useClickOutside(nodeRef, () => {
		toggle();
	});

	return (
		<div className={dropdownCln}>
			<div aria-hidden className={cn('dropdown__header', dropdownHeaderCln)} onClick={toggle}>
				<div className={avatarCln}>
					<img
						crossOrigin='anonymous'
						width={32}
						height={32}
						loading='lazy'
						src={PATH_IMAGES.AVATAR_PLACEHOLDER}
						alt={info.username}
					/>
				</div>
				<div className={profileCln}>
					<h3 className={nameCln}>{fullName}</h3>
					<div className={emailCln}>{email}</div>
				</div>
			</div>
			<CSSTransition in={isOpen} timeout={300} classNames='dropdown-menu' unmountOnExit nodeRef={nodeRef}>
				<div className={cn('dropdown__list', dropdownListCln)} ref={nodeRef}>
					<ul>
						<DropdownItem type='li' customOnClick={handleRedirect}>
							<span>
								<AiOutlineSetting size='1.25em' />
								<span>
									<FormattedMessage id='common.profile' />
								</span>
							</span>
						</DropdownItem>
						<Divider type='li' />
						<DropdownItem type='li' customOnClick={handleLogout}>
							<span>
								<MdLogout size='1.25em' />
								<FormattedMessage id='common.logout' />
							</span>
						</DropdownItem>
					</ul>
				</div>
			</CSSTransition>
		</div>
	);
}
