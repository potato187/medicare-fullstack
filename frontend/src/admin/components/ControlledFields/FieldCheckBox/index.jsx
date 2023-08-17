import React from 'react';
import { FormattedMessage } from 'react-intl';

function FieldCheckBox({ labelIntl, ...props }, ref) {
	return (
		<label className='field-input-check'>
			<input type='checkbox' {...props} ref={ref} />
			{labelIntl ? (
				<span>
					<FormattedMessage id={labelIntl} />
				</span>
			) : null}
		</label>
	);
}

export default React.forwardRef(FieldCheckBox);
