import React from 'react';
import { MdDragIndicator } from 'react-icons/md';
import { Action } from '../Action';

export const Handle = React.forwardRef((props, ref) => {
	return (
		<Action ref={ref} cursor='grab' data-cypress='draggable-handle' {...props}>
			<MdDragIndicator size='1.25em' />
		</Action>
	);
});
