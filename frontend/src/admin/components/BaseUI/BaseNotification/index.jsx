import { useTheme } from 'admin/contexts';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './style.scss';

export function BaseNotification({ ...props }) {
	const context = useTheme();
	const theme = context?.theme?.themeMode === 'theme_light' ? 'light' : 'dark';

	return <ToastContainer autoClose='2000' theme={theme} {...props} />;
}
