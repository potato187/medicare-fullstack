import { BaseDropdown, Divider, DropdownBody, DropdownHeader, DropdownItem } from 'admin/components/BaseUI';
import { PATH_IMAGES } from 'admin/constant';
import { authLogout } from 'admin/redux/slices/auth';
import cn from 'classnames';
import { useAuth } from 'hooks';
import { AiOutlineSetting } from 'react-icons/ai';
import { MdLogout } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import module from './style.module.scss';

export function UserMenu() {
	const { info, tokens } = useAuth();
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

	return (
		<BaseDropdown className={dropdownCln}>
			<DropdownHeader className={cn('dropdown__header', dropdownHeaderCln)}>
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
			</DropdownHeader>
			<DropdownBody className={cn('dropdown__list', dropdownListCln)}>
				<ul>
					<DropdownItem type='li'>
						<NavLink to='./personal/profile_setting'>
							<AiOutlineSetting size='1.25em' />
							<span>
								<FormattedMessage id='common.profile' />
							</span>
						</NavLink>
					</DropdownItem>
					<Divider type='li' />
					<DropdownItem type='li' customOnClick={handleLogout}>
						<span>
							<MdLogout size='1.25em' />
							<FormattedMessage id='common.logout' />
						</span>
					</DropdownItem>
				</ul>
			</DropdownBody>
		</BaseDropdown>
	);
}
