import React from 'react';
import { Action } from '../Action';
import { MdDragIndicator } from 'react-icons/md';

export const Handle = React.forwardRef((props, ref) => {
	return (
		<Action ref={ref} cursor='grab' data-cypress='draggable-handle' {...props}>
			<MdDragIndicator size='1.25em' />
		</Action>
	);
});
