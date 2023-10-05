import { BaseDropdown, DropdownBody, DropdownHeader, DropdownItem } from 'admin/components/BaseUI';
import { PATH_IMAGES } from 'admin/constant';
import { authLogout } from 'admin/redux/slices/auth';
import { useAuth } from 'hooks';
import { AiOutlineSetting } from 'react-icons/ai';
import { MdLogout } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import module from './style.module.scss';

export function UserMenu({ username, email }) {
	const { info, tokens } = useAuth();
	const dispatch = useDispatch();
	const {
		'user-dropdown': userDropdownCln,
		'user-dropdown__toggle': toggleCln,
		avatar: avatarCln,
		profile: profileCln,
		name: nameCln,
		email: emailCln,
		'user-dropdown__menu': menuCln,
		list: listCln,
		divider: dividerCln,
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
		<BaseDropdown className={userDropdownCln}>
			<DropdownHeader className={toggleCln}>
				<div className={avatarCln}>
					<img
						crossOrigin='anonymous'
						width={32}
						height={32}
						loading='lazy'
						/* src={SERVER_URL + '/' + image} */
						src={PATH_IMAGES.AVATAR_PLACEHOLDER}
						alt={username}
					/>
				</div>
				<div className={profileCln}>
					<h3 className={nameCln}>{username}</h3>
					<div className={emailCln}>{email}</div>
				</div>
			</DropdownHeader>
			<DropdownBody className={menuCln}>
				<ul className={listCln}>
					<DropdownItem type='li'>
						<NavLink to=''>
							<AiOutlineSetting size='1.25em' />
							<span>Profile</span>
						</NavLink>
					</DropdownItem>
					<li className={dividerCln} />
					<DropdownItem type='li' customOnClick={handleLogout}>
						<span>
							<MdLogout size='1.25em' />
							<span>Logout</span>
						</span>
					</DropdownItem>
				</ul>
			</DropdownBody>
		</BaseDropdown>
	);
}
