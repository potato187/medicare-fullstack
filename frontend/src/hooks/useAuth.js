import { useSelector } from 'react-redux';

export function useAuth() {
	const auth = useSelector((state) => state.auth);
	return auth ? auth : {};
}
