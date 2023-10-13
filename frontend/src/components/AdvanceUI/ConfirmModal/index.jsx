import { BaseModal, BaseModalBody, BaseModalFooter, BaseModalHeader, Button } from 'components/BaseUI';
import { useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

export function ConfirmModal({
	idTitleIntl = '',
	isOpen = false,
	children = null,
	onClose = (f) => f,
	onSubmit = (f) => f,
}) {
	const { handleSubmit } = useForm();

	return (
		<BaseModal size='sm' isOpen={isOpen} onClose={onClose}>
			<BaseModalHeader idIntl={idTitleIntl} onClose={onClose} />
			<BaseModalBody>{children}</BaseModalBody>
			<BaseModalFooter>
				<form onSubmit={handleSubmit(onSubmit)} className='d-flex justify-content-end gap-2'>
					<Button type='button' size='xs' secondary onClick={onClose}>
						<FormattedMessage id='button.close' />
					</Button>
					<Button type='submit' size='xs' danger>
						<FormattedMessage id='button.confirm' />
					</Button>
				</form>
			</BaseModalFooter>
		</BaseModal>
	);
}
