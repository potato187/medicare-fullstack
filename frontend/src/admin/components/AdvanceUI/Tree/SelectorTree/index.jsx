import cn from 'classnames';
import { useMemo } from 'react';
import { buildTree } from '../utilities';
import { RenderTree } from './RenderTree';
import module from './style.module.scss';

export function SelectorTree({ languageId = 'en', tree = [], onChange = () => null }) {
	const flattenedTree = useMemo(() => buildTree(tree), [tree]);
	const { tree: treeCln } = module;
	const styles = cn(treeCln);

	return (
		<div className={styles}>
			<RenderTree languageId={languageId} data={flattenedTree} onChange={onChange} />
		</div>
	);
}
