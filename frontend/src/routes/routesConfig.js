import { ADMIN_ROLE, MOD_ROLE } from 'constant';
import {
	MdOutlineAdminPanelSettings,
	MdLanguage,
	MdOutlineMedicalServices,
	MdOutlineViewTimeline,
	MdOutlineAccountCircle,
	MdOutlineNewspaper,
	MdOutlineLocalHospital,
} from 'react-icons/md';

export const routesConfig = [
	{
		to: '/admin/dashboard/languages',
		intl: 'dashboard.languages.title',
		Icon: MdLanguage,
		allowedRoles: [ADMIN_ROLE],
		listChildren: [
			{
				intl: 'dashboard.languages.vi.title',
				to: '/admin/dashboard/languages/vi',
			},
			{
				intl: 'dashboard.languages.en.title',
				to: '/admin/dashboard/languages/en',
			},
		],
	},
	{
		to: '/admin/dashboard/personal',
		intl: 'dashboard.personal.profile_setting.title',
		Icon: MdOutlineAccountCircle,
		allowedRoles: [ADMIN_ROLE, MOD_ROLE],
	},
	{
		to: '/admin/dashboard/modules',
		intl: 'dashboard.modules.title',
		Icon: MdOutlineViewTimeline,
		allowedRoles: [ADMIN_ROLE, MOD_ROLE],
		listChildren: [
			{
				intl: 'dashboard.modules.setting.title',
				to: '/admin/dashboard/modules/setting',
			},
			{
				intl: 'dashboard.modules.header.title',
				to: '/admin/dashboard/modules/header',
			},
			{
				intl: 'dashboard.modules.footer.title',
				to: '/admin/dashboard/modules/footer',
			},
			{
				intl: 'dashboard.modules.html_content.title',
				to: '/admin/dashboard/modules/html_content',
			},
		],
	},
	{
		to: '/admin/dashboard/admin',
		intl: 'dashboard.admin.title',
		Icon: MdOutlineAdminPanelSettings,
		allowedRoles: [ADMIN_ROLE],
	},
	{
		to: '/admin/dashboard/specialty',
		intl: 'dashboard.specialty.title',
		Icon: MdOutlineLocalHospital,
		allowedRoles: [ADMIN_ROLE, MOD_ROLE],
	},
	{
		to: '/admin/dashboard/booking',
		intl: 'dashboard.booking.title',
		Icon: MdOutlineMedicalServices,
		allowedRoles: [ADMIN_ROLE, MOD_ROLE],
	},
	{
		to: '/admin/dashboard/blogs',
		intl: 'dashboard.blogs.title',
		Icon: MdOutlineNewspaper,
		allowedRoles: [ADMIN_ROLE, MOD_ROLE],
		listChildren: [
			{
				intl: 'dashboard.blogs.categories.title',
				to: '/admin/dashboard/blogs/categories',
			},
			{
				intl: 'dashboard.blogs.manage.title',
				to: '/admin/dashboard/blogs/manage',
			},
			{
				intl: 'dashboard.blogs.news.title',
				to: '/admin/dashboard/blogs/news',
			},
		],
	},
];
