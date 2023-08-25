import React, { useId } from 'react';
import { FormattedMessage } from 'react-intl';

function FieldCheckBox({ labelIntl, ...props }, ref) {
	const domId = useId();
	return (
		<label className='field-input-check' htmlFor={domId}>
			<input type='checkbox' {...props} ref={ref} id={domId} />
			{labelIntl ? (
				<span>
					<FormattedMessage id={labelIntl} />
				</span>
			) : null}
		</label>
	);
}

export default React.forwardRef(FieldCheckBox);
