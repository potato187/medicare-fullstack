import { MdSettings } from 'react-icons/md';
import { Action } from '../Action';

export function Update(props) {
	return (
		<Action {...props}>
			<MdSettings size='1.25em' />
		</Action>
	);
}
