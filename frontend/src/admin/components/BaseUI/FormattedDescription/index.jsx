import { FormattedMessage } from 'react-intl';

function BlobText(props) {
	return <b>{props?.chucks}</b>;
}

function SpanText(props) {
	return <span>{props?.chucks}</span>;
}

export function FormattedDescription({ id, values, ...props }) {
	return (
		<FormattedMessage
			id={id}
			values={{
				...values,
				b: (chunks) => BlobText({ chunks }),
				span: (chucks) => SpanText({ chucks }),
			}}
			{...props}
		/>
	);
}
