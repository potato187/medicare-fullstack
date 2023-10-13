import urlJoin from 'url-join';
import { PATH_IMAGES } from 'constant';
import { typeOf } from './repos';

const getImageThumbnail = (url) => {
	return url ? urlJoin(import.meta.env.VITE_REACT_APP_SERVER_URL, url) : PATH_IMAGES.BANNER_PLACEHOLDER;
};

const getUrlHtmlContent = (url) => {
	return url ? urlJoin(import.meta.env.VITE_REACT_APP_SERVER_URL, url) : PATH_IMAGES.BANNER_PLACEHOLDER;
};

const getUrlStrategy = {
	thumbnail: getImageThumbnail,
	htmlContent: getUrlHtmlContent,
};

export const generateUrl = (url, type = 'thumbnail') => {
	return getUrlStrategy?.[type](url);
};

export const getFileName = (file) => {
	if (!file) return null;
	if (typeOf(file) === 'string') return file;
	return file[0]?.name || '';
};

export const isValidExtension = (extensions = []) => {
	return (filename) => {
		if (!filename || !filename.trim().length) return false;
		const ext = filename.split('.').pop().toLowerCase();
		return extensions.includes(ext);
	};
};
