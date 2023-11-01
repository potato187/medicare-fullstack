import { Item } from './Item';

export function RenderTree({ languageId, data = [], onChange = () => null }) {
	return (
		<ul>
			{data.map((item) => (
				<Item languageId={languageId} key={item.id} data={item} onChange={onChange}>
					{item?.children?.length ? (
						<RenderTree languageId={languageId} data={item.children} onChange={onChange} />
					) : null}
				</Item>
			))}
		</ul>
	);
}
