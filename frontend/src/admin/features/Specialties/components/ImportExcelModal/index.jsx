import { yupResolver } from '@hookform/resolvers/yup';
import {
	BaseModal,
	BaseModalBody,
	BaseModalFooter,
	BaseModalHeader,
	Button,
	FloatingLabelFileExcel,
	Table,
	TableBody,
	TableGrid,
	TableHeader,
	TdInput,
	TdSelect,
	TrStatus,
} from 'admin/components';
import { extractFirstNameLastName, tryCatch, tryCatchAndToast } from 'admin/utilities';
import { emailValidation, fileExcelValidation, phoneValidation, requiredValidation } from 'admin/validation';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import { readFileExcel } from 'utils';
import * as yup from 'yup';
import { IMPORT_STATUS, doctorDefaultValue } from './constant';

export function ImportExcelModal({
	isOpen = false,
	specialtyId = '',
	languageId = 'en',
	genders = [],
	positions = [],
	onClose = (f) => f,
	onSubmit = (f) => f,
}) {
	const methodsFileExcel = useForm({
		mode: 'onChange',
		defaultValues: {
			fileExcel: '',
		},
		resolver: yupResolver(
			yup.object().shape({
				fileExcel: fileExcelValidation,
			}),
		),
	});

	const methods = useForm({
		mode: 'onChange',
		defaultValues: {
			doctors: [doctorDefaultValue],
		},
		resolver: yupResolver(
			yup.object().shape({
				doctors: yup.array().of(
					yup.object().shape({
						firstName: requiredValidation,
						lastName: requiredValidation,
						email: emailValidation,
						address: requiredValidation,
						phone: phoneValidation,
					}),
				),
			}),
		),
	});

	const { fields, remove, insert } = useFieldArray({
		control: methods.control,
		name: 'doctors',
	});

	const handleRemoveItem = (index) => {
		remove(index);
	};

	const handleInsertItem = () => {
		insert(fields.length + 1, { ...doctorDefaultValue });
	};

	const handleUploadExcelFile = tryCatchAndToast(async ({ fileExcel }) => {
		const jsonData = await readFileExcel(fileExcel);
		const doctors = jsonData.map((doctor) => {
			const { fullName, email, phone, address, position, gender } = doctor;
			const { firstName, lastName } = extractFirstNameLastName(fullName);
			const _gender = genders.find((genderItem) => genderItem.label.toLowerCase() === gender.toLowerCase());
			const _position = positions.find((positionItem) => positionItem.label.toLowerCase() === position.toLowerCase());

			return {
				firstName,
				lastName,
				email,
				phone,
				address,
				gender: _gender.value,
				position: _position.value,
				importStatus: IMPORT_STATUS.PREPARE,
				specialtyId,
			};
		});
		methods.setValue('doctors', doctors);
	}, languageId);

	const removeDoctorsWithFailedImport = (doctors) => {
		const doctorsFilter = doctors.filter(({ importStatus }) => importStatus !== IMPORT_STATUS.SUCCESS);
		methods.setValue('doctors', doctorsFilter);
		return doctorsFilter;
	};

	const updateDoctorsWithImportResults = (importedDoctors) => {
		importedDoctors.forEach(({ index, status }) => {
			const value = status !== 'reject' ? IMPORT_STATUS.SUCCESS : IMPORT_STATUS.FAIL;
			methods.setValue(`doctors.${index}.importStatus`, value);
		});
	};

	const handleOnSubmit = tryCatchAndToast(async ({ doctors }) => {
		const filteredDoctors = removeDoctorsWithFailedImport(doctors);
		const {
			message,
			metadata: { doctorsStatus },
		} = await onSubmit([...filteredDoctors]);
		toast.success(message[languageId]);
		updateDoctorsWithImportResults(doctorsStatus);
	}, languageId);

	return (
		<BaseModal size='lg' isOpen={isOpen}>
			<BaseModalHeader idIntl='dashboard.specialty.modal.import_modal.title' onClose={onClose} />
			<BaseModalBody>
				<FormProvider {...methodsFileExcel}>
					<form className='mb-6' onSubmit={methods.handleSubmit(handleOnSubmit)}>
						<div className='row'>
							<div className='col-6'>
								<FloatingLabelFileExcel
									className='grow-1'
									name='fileExcel'
									labelIntl='form.files'
									onSubmit={handleUploadExcelFile}
								/>
							</div>
						</div>
					</form>
				</FormProvider>
				<FormProvider {...methods}>
					<form>
						<TableGrid className='scrollbar scrollbar--sm' style={{ height: '334px' }}>
							<Table id='table-import-excel' border striped editContent>
								<TableHeader>
									<th className='text-center'>No.</th>
									<th className='text-start'>
										<FormattedMessage id='form.firstName' />
									</th>
									<th className='text-start'>
										<FormattedMessage id='form.lastName' />
									</th>
									<th className='text-start'>
										<FormattedMessage id='form.email' />
									</th>
									<th className='text-start'>
										<FormattedMessage id='form.phone' />
									</th>
									<th className='text-start'>
										<FormattedMessage id='form.address' />
									</th>
									<th className='text-center'>
										<FormattedMessage id='common.gender' />
									</th>
									<th className='text-center'>
										<FormattedMessage id='common.position' />
									</th>
									<th className='text-center'>
										<FormattedMessage id='table.actions' />
									</th>
								</TableHeader>
								<TableBody>
									{fields.map((field, index) => (
										<TrStatus
											status={methods.getValues(`doctors.${index}.importStatus`).toLocaleLowerCase()}
											key={field.id}
										>
											<td className='text-center'>{index + 1}</td>
											<TdInput className='text-center' name={`doctors.${index}.firstName`} />
											<TdInput className='text-center' name={`doctors.${index}.lastName`} />
											<TdInput className='text-center' name={`doctors.${index}.email`} />
											<TdInput className='text-center' name={`doctors.${index}.phone`} />
											<TdInput className='text-center' name={`doctors.${index}.address`} />
											<TdSelect data-parent='table-import-excel' options={genders} name={`doctors.${index}.gender`} />
											<TdSelect
												data-parent='table-import-excel'
												options={positions}
												name={`doctors.${index}.position`}
											/>
											<td className='text-center'>
												<Button size='xs' danger soft onClick={() => handleRemoveItem(index)}>
													<MdOutlineDeleteOutline size='1.5em' />
												</Button>
											</td>
										</TrStatus>
									))}
								</TableBody>
							</Table>
						</TableGrid>
					</form>
				</FormProvider>
			</BaseModalBody>
			<BaseModalFooter>
				<div className='d-flex justify-content-end gap-2'>
					<Button size='xs' type='button' secondary onClick={onClose}>
						<FormattedMessage id='button.cancel' />
					</Button>
					<Button size='xs' type='button' success onClick={handleInsertItem}>
						<FormattedMessage id='button.add' />
					</Button>
					<Button size='xs' type='submit' onClick={methods.handleSubmit(handleOnSubmit)}>
						<FormattedMessage id='button.import' />
					</Button>
				</div>
			</BaseModalFooter>
		</BaseModal>
	);
}
