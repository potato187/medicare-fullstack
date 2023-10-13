export function Item({ languageId = 'en', data = {}, onChange = () => null, children }) {
	const { id, isSelected, name } = data;

	return (
		<li>
			<label htmlFor={id} className='field-checkbox'>
				<input type='checkbox' name={id} id={id} defaultValue='' checked={isSelected} onChange={() => onChange(id)} />
				<span>{name[languageId]}</span>
			</label>
			{children}
		</li>
	);
}
