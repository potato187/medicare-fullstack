import React from 'react';

import { MdOutlineClose } from 'react-icons/md';
import { Action } from '../Action';

export function Remove(props) {
	return (
		<Action {...props}>
			<MdOutlineClose size='1em' />
		</Action>
	);
}
