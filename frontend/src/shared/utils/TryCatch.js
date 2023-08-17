import { toast } from 'react-toastify';

export const tryCatch = (callback, languageId = 'en', finallyCallback = null) => {
	return async (...props) => {
		try {
			await Promise.resolve(callback(...props));
		} catch (error) {
			const errorMessage = error?.message?.[languageId] || 'An error occurred.';
			toast.error(errorMessage);
			console.error(error);
		} finally {
			finallyCallback && finallyCallback();
		}
	};
};
