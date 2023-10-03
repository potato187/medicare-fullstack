import React from 'react';

const delay = 300;

export const LazyLanguageManager = React.lazy(() => {
	return new Promise((resolve) => {
		setTimeout(() => resolve(import('../features/Languages/pages/LanguageManager')), delay);
	});
});

export const LazyAdminManager = React.lazy(() => {
	return new Promise((resolve) => {
		setTimeout(() => resolve(import('../features/Admins/pages/AdminManager')), delay);
	});
});

export const LazySpecialtyManager = React.lazy(() => {
	return new Promise((resolve) => {
		setTimeout(() => resolve(import('../features/Specialties/pages/SpecialtyManager')), delay);
	});
});

export const LazyBookingManager = React.lazy(() => {
	return new Promise((resolve) => {
		setTimeout(() => resolve(import('../features/Bookings/pages/BookingManager')), delay);
	});
});

export const LazyBlogCategoryManager = React.lazy(() => {
	return new Promise((resolve) => {
		setTimeout(() => resolve(import('../features/Blogs/pages/BlogCategoryManager')), delay);
	});
});

export const LazyNewsManager = React.lazy(() => {
	return new Promise((resolve) => {
		setTimeout(() => resolve(import('../features/Blogs/pages/NewsManager')), delay);
	});
});

export const LazyBlogsManager = React.lazy(() => {
	return new Promise((resolve) => {
		setTimeout(() => resolve(import('../features/Blogs/pages/BlogsManager')), delay);
	});
});

export const LazySettingConfigManager = React.lazy(() => {
	return new Promise((resolve) => {
		setTimeout(() => resolve(import('../features/Modules/pages/SettingConfigManager')), delay);
	});
});

export const LazyHeaderManager = React.lazy(() => {
	return new Promise((resolve) => {
		setTimeout(() => resolve(import('../features/Modules/pages/HeaderManager')), delay);
	});
});

export const LazyFooterManager = React.lazy(() => {
	return new Promise((resolve) => {
		setTimeout(() => resolve(import('../features/Modules/pages/FooterManager')), delay);
	});
});

export const LazyHtmlContentManager = React.lazy(() => {
	return new Promise((resolve) => {
		setTimeout(() => resolve(import('../features/Modules/pages/HtmlContentManager')), delay);
	});
});

export const LazyLoginPage = React.lazy(() => {
	return new Promise((resolve) => {
		setTimeout(() => resolve(import('../features/Auth/pages/LoginPage')), delay);
	});
});
