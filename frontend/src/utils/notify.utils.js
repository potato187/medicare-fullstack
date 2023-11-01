import { toast } from 'react-toastify';

export const showToastMessage = (message, languageId, type = 'success') => {
	toast[type](message[languageId]);
};
