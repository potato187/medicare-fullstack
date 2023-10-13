import {
	DndContext,
	DragOverlay,
	KeyboardSensor,
	MeasuringStrategy,
	PointerSensor,
	closestCenter,
	defaultDropAnimation,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { SortableTreeItem } from './TreeItem';
import { sortableTreeKeyboardCoordinates } from './keyboardCoordinates';
import {
	arrangeTreeIndices,
	buildTree,
	findItemDeep,
	flattenTree,
	getChildCount,
	getProjection,
	removeChildrenOf,
	setProperty,
} from '../utils';

const measuring = {
	droppable: {
		strategy: MeasuringStrategy.Always,
	},
};

const dropAnimationConfig = {
	keyframes({ transform }) {
		return [
			{ opacity: 1, transform: CSS.Transform.toString(transform.initial) },
			{
				opacity: 0,
				transform: CSS.Transform.toString({
					...transform.final,
					x: transform.final.x + 5,
					y: transform.final.y + 5,
				}),
			},
		];
	},
	easing: 'ease-out',
	sideEffects({ active }) {
		active.node.animate([{ opacity: 0 }, { opacity: 1 }], {
			duration: defaultDropAnimation.duration,
			easing: defaultDropAnimation.easing,
		});
	},
};

export function SortableTree({
	items = [],
	languageId = 'en',
	collapsible = false,
	indicator = false,
	removable = false,
	indentationWidth = 50,
	setItems = () => [],
	handleModifyItem = (f) => f,
	handleConfirmDeletion = (f) => f,
}) {
	const [activeId, setActiveId] = useState(null);
	const [overId, setOverId] = useState(null);
	const [offsetLeft, setOffsetLeft] = useState(0);

	const flattenedItems = useMemo(() => {
		const flattenedTree = flattenTree(items);
		const collapsedItems = flattenedTree.reduce(
			(acc, { children, collapsed, id }) => (collapsed && children.length ? [...acc, id] : acc),
			[],
		);
		return removeChildrenOf(flattenedTree, activeId ? [activeId, ...collapsedItems] : collapsedItems);
	}, [activeId, items]);

	const projected =
		activeId && overId ? getProjection(flattenedItems, activeId, overId, offsetLeft, indentationWidth) : null;

	const sensorContext = useRef({
		items: flattenedItems,
		offset: offsetLeft,
	});

	const [coordinateGetter] = useState(() =>
		sortableTreeKeyboardCoordinates(sensorContext, indicator, indentationWidth),
	);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter,
		}),
	);

	const sortedIds = useMemo(() => flattenedItems.map(({ id }) => id), [flattenedItems]);
	const activeItem = activeId ? flattenedItems.find(({ id }) => id === activeId) : null;

	useEffect(() => {
		sensorContext.current = {
			items: flattenedItems,
			offset: offsetLeft,
		};
	}, [flattenedItems, offsetLeft]);

	const handleDragStart = ({ active: { id: activeId } }) => {
		setActiveId(activeId);
		setOverId(activeId);

		document.body.style.setProperty('cursor', 'grabbing');
	};

	const handleDragMove = ({ delta }) => {
		setOffsetLeft(delta.x);
	};

	const handleDragOver = ({ over }) => {
		setOverId(over?.id ?? null);
	};

	function resetState() {
		setOverId(null);
		setActiveId(null);
		setOffsetLeft(0);

		document.body.style.setProperty('cursor', '');
	}

	const handleDragEnd = ({ active, over }) => {
		resetState();

		if (projected && over) {
			const { depth, parentId } = projected;
			const clonedItems = JSON.parse(JSON.stringify(flattenTree(items)));
			const overIndex = clonedItems.findIndex(({ id }) => id === over.id);
			const activeIndex = clonedItems.findIndex(({ id }) => id === active.id);
			const activeTreeItem = clonedItems[activeIndex];

			clonedItems[activeIndex] = { ...activeTreeItem, depth, parentId };

			const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);

			const newItems = arrangeTreeIndices(buildTree(sortedItems));

			setItems(newItems);
		}
	};

	function handleDragCancel() {
		resetState();
	}

	function handleRemove(id) {
		handleConfirmDeletion(findItemDeep(items, id));
	}

	function handleUpdate(id) {
		handleModifyItem(findItemDeep(items, id));
	}

	function handleCollapse(id) {
		const newItems = setProperty([...items], id, 'collapsed', (value) => !value);
		setItems(newItems);
	}

	function adjustTranslate({ transform }) {
		return {
			...transform,
			y: transform.y - 25,
		};
	}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			measuring={measuring}
			onDragStart={handleDragStart}
			onDragMove={handleDragMove}
			onDragOver={handleDragOver}
			onDragEnd={handleDragEnd}
			onDragCancel={() => handleDragCancel()}
		>
			<SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
				{flattenedItems.map(({ id, children, collapsed, depth, ...rest }) => (
					<SortableTreeItem
						key={id}
						id={id}
						data-display={rest.isDisplay ? 'show' : 'hidden'}
						value={rest?.name[languageId]}
						depth={id === activeId && projected ? projected.depth : depth}
						indentationWidth={indentationWidth}
						indicator={indicator}
						collapsed={Boolean(collapsed && children.length)}
						onCollapse={collapsible && children.length ? () => handleCollapse(id) : undefined}
						onRemove={removable ? () => handleRemove(id) : undefined}
						onUpdate={removable ? () => handleUpdate(id) : undefined}
					/>
				))}
				{createPortal(
					<DragOverlay dropAnimation={dropAnimationConfig} modifiers={indicator ? [adjustTranslate] : undefined}>
						{activeId && activeItem ? (
							<SortableTreeItem
								id={activeId}
								depth={activeItem.depth}
								clone
								childCount={getChildCount(items, activeId) + 1}
								value={activeItem?.name?.[languageId]}
								indentationWidth={indentationWidth}
							/>
						) : null}
					</DragOverlay>,
					document.body,
				)}
			</SortableContext>
		</DndContext>
	);
}
