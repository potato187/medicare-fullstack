import { Container } from 'admin/components';
import { Button } from 'bootstrap';
import { MdAdd } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';

export function NewsManager() {
	return (
		<Container id='page-main'>
			<div className='d-flex flex-column h-100 py-5'>
				<div className='d-flex pb-4'>
					<div className='d-flex items-end gap-2' />
					<div className='px-5 d-flex gap-2 ms-auto'>
						<Button size='sm'>
							<span>
								<FormattedMessage id='dashboard.blogs.modal.button_create_blog' />
							</span>
							<MdAdd size='1.25em' className='ms-2' />
						</Button>
					</div>
				</div>
			</div>
		</Container>
	);
}
