const SORT_OPTIONS = ['createdAt_desc', 'highlight_blog'];
const PAGES = ['home', 'blog', 'blog_category', 'contact'];
const PAGE_POSITIONS = ['header', 'main', 'footer', 'top', 'left', 'bottom', 'right'];
const SELECT_FIELDS = ['_id', 'name', 'pageType', 'pagePosition', 'blogCategoryIds', 'index', 'order', 'quantity'];
const SORTABLE_FIELDS = ['pageType', 'pagePosition', 'index'];

module.exports = {
	PAGES,
	PAGE_POSITIONS,
	SORT_OPTIONS,
	SELECT_FIELDS,
	SORTABLE_FIELDS,
};
