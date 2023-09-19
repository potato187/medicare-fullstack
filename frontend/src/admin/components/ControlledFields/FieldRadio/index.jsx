import React, { useId } from 'react';
import { FormattedMessage } from 'react-intl';

function FieldRadio({ labelIntl, ...props }, ref) {
	const domId = useId();

	return (
		<label className='field-input-check' htmlFor={domId}>
			<input id={domId} type='radio' ref={ref} {...props} />
			{labelIntl ? (
				<span>
					<FormattedMessage id={labelIntl} />
				</span>
			) : null}
		</label>
	);
}

export default React.forwardRef(FieldRadio);
