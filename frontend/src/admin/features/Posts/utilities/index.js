export const addHierarchyInfoToItems = (items, parentId = null, depth = 0) => {
	return items.map((item) => {
		item.parentId = parentId;
		item.collapsed = false;
		item.depth = depth;
		if (item.children) {
			item.children = addHierarchyInfoToItems(item.children, item.id, depth + 1);
		}
		return item;
	});
};
