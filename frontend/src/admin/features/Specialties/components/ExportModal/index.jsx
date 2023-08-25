import { useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { BaseModal, BaseModalBody, BaseModalFooter, BaseModalHeader, Button, FieldCheckBox } from 'admin/components';

export function ExportModal({ titleIntl = '', isOpen = false, onClose = () => false, onSubmit = () => null }) {
	const methods = useForm({
		defaultValues: {
			export_option: 'all',
		},
	});

	return (
		<BaseModal size='sm' isOpen={isOpen}>
			<BaseModalHeader idIntl={titleIntl} onClose={onClose} />
			<BaseModalBody>
				<form onSubmit={methods.handleSubmit(onSubmit)}>
					<div className='d-flex flex-column gap-2'>
						<FieldCheckBox
							{...methods.register('export_option')}
							type='radio'
							value='all'
							labelIntl='dashboard.specialty.modal.export_modal.export_all'
						/>
						<FieldCheckBox
							{...methods.register('export_option')}
							type='radio'
							value='selected'
							labelIntl='dashboard.specialty.modal.export_modal.export_selected'
						/>
						<FieldCheckBox
							{...methods.register('export_option')}
							type='radio'
							value='per_page'
							labelIntl='dashboard.specialty.modal.export_modal.export_per_page'
						/>
					</div>
				</form>
			</BaseModalBody>
			<BaseModalFooter className='d-flex justify-content-end items-center gap-2'>
				<Button size='sm' type='button' secondary onClick={onClose}>
					<FormattedMessage id='button.cancel' />
				</Button>
				<Button
					isLoading={methods.formState.isSubmitting}
					size='sm'
					type='submit'
					onClick={methods.handleSubmit(onSubmit)}
				>
					<FormattedMessage id='button.export' />
				</Button>
			</BaseModalFooter>
		</BaseModal>
	);
}
