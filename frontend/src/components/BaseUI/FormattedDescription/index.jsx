import { FormattedMessage } from 'react-intl';

function BlobText(props) {
	return <b>{props?.chucks}</b>;
}

function SpanText(props) {
	return <span>{props?.chucks}</span>;
}

export function FormattedDescription({ id, values = {} }) {
	return (
		<FormattedMessage
			id={id}
			values={{
				b: (chucks) => BlobText({ chucks }),
				span: (chucks) => SpanText({ chucks }),
				...values,
			}}
		/>
	);
}
