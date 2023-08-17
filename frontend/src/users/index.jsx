import { NavLink } from 'react-router-dom';

export default function Users() {
	return (
		<div>
			<NavLink to='admin'>to admin</NavLink>
			<img src='http://localhost:8080/public/uploads/zalo_last_screenshot.png' />
		</div>
	);
}
