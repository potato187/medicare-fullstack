import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TreeItem } from './TreeItem';
import { iOS } from '../../utils';

const animateLayoutChanges = ({ isSorting, wasDragging }) => !(isSorting || wasDragging);

export function SortableTreeItem({ id, depth, ...props }) {
	const {
		attributes,
		isDragging,
		isSorting,
		listeners,
		transform,
		transition,
		setDraggableNodeRef,
		setDroppableNodeRef,
	} = useSortable({
		id,
		animateLayoutChanges,
	});

	const style = {
		transform: CSS.Translate.toString(transform),
		transition,
	};

	return (
		<TreeItem
			ref={setDraggableNodeRef}
			wrapperRef={setDroppableNodeRef}
			style={style}
			depth={depth}
			ghost={isDragging}
			disableSelection={iOS}
			disableInteraction={isSorting}
			handleProps={{
				...attributes,
				...listeners,
			}}
			{...props}
		/>
	);
}
