const SORT_OPTIONS = ['createdAt_desc', 'highlight_blog'];
const PAGES = ['home', 'blog', 'blog_category', 'contact'];
const PAGE_POSITIONS = ['header', 'main', 'footer', 'top', 'left', 'bottom', 'right'];
const QUERY_PAGE_POSITIONS = ['all', 'header', 'main', 'footer', 'top', 'left', 'bottom', 'right'];
const SELECT_FIELDS = [
	'_id',
	'name',
	'pageType',
	'positionType',
	'blogCategoryIds',
	'index',
	'order',
	'quantity',
	'isDisplay',
];
const SORTABLE_FIELDS = ['positionType', 'index', 'isDisplay'];

module.exports = {
	PAGES,
	QUERY_PAGE_POSITIONS,
	PAGE_POSITIONS,
	SORT_OPTIONS,
	SELECT_FIELDS,
	SORTABLE_FIELDS,
};
