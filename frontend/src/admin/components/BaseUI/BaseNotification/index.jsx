import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function BaseNotification({ ...props }) {
	return <ToastContainer autoClose='2000' {...props} />;
}
