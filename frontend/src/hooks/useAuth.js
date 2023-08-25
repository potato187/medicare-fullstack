import { useSelector } from 'react-redux';

export function useAuth() {
	const auth = useSelector((state) => {
		return state.auth;
	});
	return auth || {};
}
