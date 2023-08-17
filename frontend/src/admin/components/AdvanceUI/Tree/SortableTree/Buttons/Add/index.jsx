import { MdPlaylistAdd } from 'react-icons/md';
import { Action } from '../Action';

export function Add(props) {
	return (
		<Action {...props}>
			<MdPlaylistAdd size='1.25em' />
		</Action>
	);
}
