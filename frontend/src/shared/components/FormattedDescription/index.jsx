import { FormattedMessage } from 'react-intl';

export function FormattedDescription({ id, values, ...props }) {
	return (
		<FormattedMessage
			id={id}
			values={{
				...values,
				b: (chunks) => <b>{chunks}</b>,
				span: (chucks) => <span>{chucks}</span>,
			}}
			{...props}
		/>
	);
}
