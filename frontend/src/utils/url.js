import { PATH_IMAGES } from '@/admin/constant';
import urlJoin from 'url-join';

const getUrlPostThumbnail = (url) => {
	return url ? urlJoin(import.meta.env.VITE_REACT_APP_SERVER_URL, url) : PATH_IMAGES.BANNER_PLACEHOLDER;
};

const getUrlHtmlContent = (url) => {
	return url ? urlJoin(import.meta.env.VITE_REACT_APP_SERVER_URL, url) : PATH_IMAGES.BANNER_PLACEHOLDER;
};

const getUrlStrategy = {
	postThumbnail: getUrlPostThumbnail,
	htmlContent: getUrlHtmlContent,
};

export const generateUrl = (url, type = 'postThumbnail') => {
	return getUrlStrategy?.[type](url);
};
