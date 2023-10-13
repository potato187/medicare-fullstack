import { BaseModal, BaseModalBody, BaseModalFooter, BaseModalHeader, Button, FieldRadio } from 'components';
import { FormProvider, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';

export function ExportModal({ isOpen = false, onClose = (f) => f, onSubmit = (f) => f }) {
	const methods = useForm({
		mode: 'onChange',
		defaultValues: {
			type: 'all',
		},
	});

	return (
		<BaseModal size='sm' isOpen={isOpen}>
			<BaseModalHeader idIntl='dashboard.specialty.modal.export_modal.title' onClose={onClose} />
			<BaseModalBody>
				<FormProvider {...methods}>
					<form onSubmit={methods.handleSubmit(onSubmit)}>
						<div className='d-flex flex-column gap-2'>
							<FieldRadio
								labelIntl='dashboard.specialty.modal.export_modal.export_all'
								{...methods.register('type')}
								value='all'
							/>
							<FieldRadio
								labelIntl='dashboard.specialty.modal.export_modal.export_selected'
								{...methods.register('type')}
								value='selected'
							/>
							<FieldRadio
								labelIntl='dashboard.specialty.modal.export_modal.export_per_page'
								{...methods.register('type')}
								value='page'
							/>
						</div>
					</form>
				</FormProvider>
			</BaseModalBody>
			<BaseModalFooter className='d-flex justify-content-end items-center gap-2'>
				<Button size='xs' type='button' secondary onClick={onClose}>
					<FormattedMessage id='button.cancel' />
				</Button>
				<Button size='xs' type='submit' onClick={methods.handleSubmit(onSubmit)}>
					<FormattedMessage id='button.export' />
				</Button>
			</BaseModalFooter>
		</BaseModal>
	);
}
