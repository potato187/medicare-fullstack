import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const withRoleCheck = (Component = () => null, allowedRoles = [], to = '../../user-profile') => {
	return function WrapperComponent(props) {
		const { roleId = '' } = useSelector((state) => state.auth?.payload);
		const navigate = useNavigate();
		if (!allowedRoles.includes(roleId)) {
			navigate(to, { replace: true });
		}

		return <Component {...props} />;
	};
};
