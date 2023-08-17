import { BaseModal, BaseModalBody, BaseModalFooter, BaseModalHeader, Button } from '@/admin/components';
import { useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

export function ConfirmModal({
	idTitleIntl = '',
	isOpen = false,
	onClose = () => false,
	onSubmit = () => null,
	children,
}) {
	const { formState, handleSubmit } = useForm();

	return (
		<BaseModal size='sm' isOpen={isOpen} onClose={onClose}>
			<BaseModalHeader idIntl={idTitleIntl} onClose={onClose} />
			<BaseModalBody>{children}</BaseModalBody>
			<BaseModalFooter>
				<form onSubmit={handleSubmit(onSubmit)} className='d-flex justify-content-end gap-2'>
					<Button type='button' size='sm' secondary onClick={onClose}>
						<FormattedMessage id='button.close' />
					</Button>
					<Button type='submit' size='sm' danger>
						<FormattedMessage id='button.confirm' />
					</Button>
				</form>
			</BaseModalFooter>
		</BaseModal>
	);
}
