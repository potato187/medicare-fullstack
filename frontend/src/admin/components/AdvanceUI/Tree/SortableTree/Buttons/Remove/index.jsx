import React from 'react';

import { Action } from '../Action';
import { MdOutlineClose } from 'react-icons/md';

export function Remove(props) {
	return (
		<Action {...props}>
			<MdOutlineClose size='1em' />
		</Action>
	);
}
