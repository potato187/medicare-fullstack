import produce from 'immer';
import { useMemo } from 'react';
import module from './style.module.scss';
import { findIndexById, findIndexByParentId } from '../utilities';
import cn from 'classnames';
import { buildTree } from '../utilities';

const Item = ({ data = {}, onChange = () => null, children }) => {
	const { id, isSelected, title, name } = data;

	return (
		<li>
			<label htmlFor={id} className='field-input-check'>
				<input type='checkbox' name={name} id={id} checked={isSelected} onChange={() => onChange(id)} />
				<span>{title}</span>
			</label>
			{children}
		</li>
	);
};

const RenderTree = ({ data = [], onChange = () => null }) => {
	return (
		<ul>
			{data.map((item) => (
				<Item key={item.id} data={item} onChange={onChange}>
					{item?.children?.length ? <RenderTree data={item.children} onChange={onChange} /> : null}
				</Item>
			))}
		</ul>
	);
};

export function SelectorTree({ name, tree = [], setTree = () => {} }) {
	const flattenedTree = useMemo(() => buildTree(tree), [tree]);

	const { tree: treeCln } = module;
	const styles = cn(treeCln);

	const onChange = (id) => {
		setTree(
			produce((draft) => {
				const index = findIndexById(draft, id);
				draft[index].isSelected = !draft[index].isSelected;
				if (draft[index].isSelected) {
					const parentIndices = findIndexById(draft, draft[index].parentId);
					while (parentIndices.length) {
						const index = parentIndices.pop();
						const { parentId } = draft[index];
						draft[index].isSelected = true;
						if (parentId) {
							parentIndices.push(...findIndexById(draft, parentId));
						}
					}
				} else {
					const childIndices = findIndexById(draft, draft[index].id);
					while (childIndices.length) {
						const index = childIndices.pop();
						const { id } = draft[index];
						draft[index].isSelected = false;
						childIndices.push(...findIndexByParentId(draft, id));
					}
				}
			}),
		);
	};

	return (
		<div className={styles}>
			<RenderTree data={flattenedTree} onChange={onChange} />
		</div>
	);
}
