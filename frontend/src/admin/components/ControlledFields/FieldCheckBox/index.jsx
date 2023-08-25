import React, { useId } from 'react';
import { FormattedMessage } from 'react-intl';

function FieldCheckBox({ labelIntl, ...props }, ref) {
	const id = useId();
	return (
		<label className='field-input-check' htmlFor={id}>
			<input type='checkbox' {...props} ref={ref} id={id} />
			{labelIntl ? (
				<span>
					<FormattedMessage id={labelIntl} />
				</span>
			) : null}
		</label>
	);
}

export default React.forwardRef(FieldCheckBox);
