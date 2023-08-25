import { toast } from 'react-toastify';

export const tryCatchAndToast = (callback, languageId = 'en', finallyCallback = null) => {
	return async (...props) => {
		try {
			await Promise.resolve(callback(...props));
		} catch (error) {
			const errorMessage = error?.message?.[languageId] || 'An error occurred.';
			toast.error(errorMessage);
		} finally {
			if (finallyCallback) {
				finallyCallback();
			}
		}
	};
};

export const tryCatch = (callback, finallyCallback = null) => {
	return async (...props) => {
		try {
			await Promise.resolve(callback(...props));
		} catch (error) {
			/* console.error(error); */
		} finally {
			if (finallyCallback) {
				finallyCallback();
			}
		}
	};
};
