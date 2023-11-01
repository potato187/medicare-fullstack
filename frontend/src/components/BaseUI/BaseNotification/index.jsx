import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from 'stores';
import './style.scss';

export function BaseNotification({ ...props }) {
	const { theme } = useTheme();

	return <ToastContainer autoClose='2000' theme={theme} {...props} />;
}
