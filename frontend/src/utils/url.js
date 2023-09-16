import urlJoin from 'url-join';
import { PATH_IMAGES } from 'admin/constant';

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
