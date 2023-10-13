import { arrayMove } from '@dnd-kit/sortable';
import { flatten } from 'utils';

export const flattenTree = (items = []) => {
	return flatten(items);
};

export const removeChildrenOf = (items = [], ids = []) => {
	const excludeParentIds = [...ids];
	return items.filter((item) => {
		if (item.parentId && excludeParentIds.includes(item.parentId)) {
			if (item.children.length) {
				excludeParentIds.push(item.id);
			}
			return false;
		}

		return true;
	});
};

const getDragDepth = (offset, indentationWidth) => {
	return Math.round(offset / indentationWidth);
};

const getMaxDepth = (previousItem) => {
	return previousItem ? previousItem.depth + 1 : 0;
};

const getMinDepth = (nextItem) => {
	return nextItem ? nextItem.depth : 0;
};

export const getProjection = (items = [], activeId = null, overId = null, dragOffset = 0, indentationWidth = 1) => {
	const activeItemIndex = items.findIndex(({ id }) => {
		return id === activeId;
	});
	const activeItem = items[activeItemIndex];
	const overItemIndex = items.findIndex(({ id }) => {
		return id === overId;
	});
	const newItems = arrayMove(items, activeItemIndex, overItemIndex);
	const nextItem = newItems[overItemIndex + 1];
	const previousItem = newItems[overItemIndex - 1];
	const dragDepth = getDragDepth(dragOffset, indentationWidth);
	const projectedDepth = activeItem.depth + dragDepth;
	const maxDepth = getMaxDepth(previousItem);
	const minDepth = getMinDepth(nextItem);
	let depth = projectedDepth;

	if (projectedDepth >= maxDepth) {
		depth = projectedDepth;
	} else if (projectedDepth < minDepth) {
		depth = minDepth;
	}

	function getParentId() {
		if (depth === 0 || !previousItem) {
			return null;
		}

		if (depth === previousItem.depth) {
			return previousItem.parentId;
		}

		if (depth > previousItem.depth) {
			return previousItem.id;
		}

		const newParent = newItems
			.slice(0, overItemIndex)
			.reverse()
			.find((item) => {
				return item.depth === depth;
			})?.parentId;

		return newParent ?? null;
	}

	return {
		depth,
		maxDepth,
		minDepth,
		parentId: getParentId(newItems, previousItem, depth, overItemIndex),
	};
};

export const iOS = /iPad|iPhone|iPod/.test(navigator.platform);

export const setProperty = (items, id, property, setter) => {
	items.forEach((item) => {
		if (item.id === id) {
			item[property] = setter(item[property]);
			return;
		}

		if (item.children.length) {
			setProperty(item.children, id, property, setter);
		}
	});

	return [...items];
};

export const findItemDeep = (items = [], itemId) => {
	for (let index = 0, len = items.length; index < len; index++) {
		const { id, children } = items[index];

		if (id === itemId) {
			return items[index];
		}

		if (children.length) {
			const child = findItemDeep(children, itemId);

			if (child) {
				return child;
			}
		}
	}

	return undefined;
};

const countChildren = (items = [], count = 0) => {
	return items.reduce((acc, { children }) => {
		if (children.length) {
			return countChildren(children, acc + 1);
		}

		return acc + 1;
	}, count);
};

export const getChildCount = (items = [], id) => {
	const item = findItemDeep(items, id);

	return item ? countChildren(item.children) : 0;
};

export const findItem = (items = [], itemId) => {
	return items.find(({ id }) => {
		return id === itemId;
	});
};

export const arrangeTreeIndices = (items = []) => {
	return items.reduce((acc, item, index) => {
		return [...acc, { ...item, index, children: arrangeTreeIndices(item.children) }];
	}, []);
};

export const buildTree = (flattenedItems = []) => {
	const root = { id: 'root', children: [] };
	const nodes = { [root.id]: root };
	const items = flattenedItems.map((item) => {
		return { ...item, children: [] };
	});

	items.forEach((item) => {
		const { id, children } = item;
		const parentId = item.parentId ?? root.id;

		const parent = nodes[parentId] ?? findItem(items, parentId);

		nodes[id] = { id, children };
		parent.children.push(item);
	});

	return root.children;
};

export const removeItem = (items = [], id) => {
	const newItems = [];
	for (let index = 0, len = items.length; index < len; index++) {
		const item = items[index];
		if (item.id === id) {
			continue;
		}

		if (item.children.length) {
			item.children = removeItem(item.children, id);
		}

		newItems.push(item);
	}

	return newItems;
};

const createIndexFinderByPredicate = (key) => {
	const persist = key;
	return (items = [], key) => {
		return items.reduce((hash, item, index) => {
			return item[persist] === key ? [...hash, index] : hash;
		}, []);
	};
};

export const findIndexById = createIndexFinderByPredicate('id');
export const findIndexByParentId = createIndexFinderByPredicate('parentId');
