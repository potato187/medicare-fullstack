import { PATH_IMAGES, SERVER_URL } from '@/admin/constant';
import { authLogout } from '@/admin/redux/slices/authSlice';
import { BaseDropdown, DropdownBody, DropdownHeader, DropdownItem } from '@/shared/components';
import { AiOutlineSetting } from 'react-icons/ai';
import { MdLogout } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import module from './style.module.scss';

export function UserMenu({ username, email, image = null }) {
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

	const handleLogOut = () => {
		dispatch(authLogout());
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
					<li className={dividerCln}></li>
					<DropdownItem type='li' customOnClick={handleLogOut}>
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
