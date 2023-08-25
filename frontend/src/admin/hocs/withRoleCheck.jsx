import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const withRoleCheck = (Component = () => null, allowedRoles = [], to = '../../user-profile') => {
	return function WrapperComponent(props) {
		const { user } = useSelector((state) => state.auth.user);

		const navigate = useNavigate();
		if (!allowedRoles.includes(user?.role)) {
			navigate(to, { replace: true });
		}

		return <Component {...props} />;
	};
};
