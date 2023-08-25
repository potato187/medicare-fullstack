import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import * as yup from 'yup';
import { readFileExcel } from 'utils';
import { emailValidation, fileExcelValidation, phoneValidation, requiredValidation } from 'admin/validation';
import { DOCTOR_POSITIONS, GENDERS, IMPORT_STATUS } from 'admin/constant';
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

export function ImportExcelModal({
	genders = [],
	positions = [],
	isOpen = false,
	onClose = () => false,
	onSubmit = () => null,
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
			doctors: [
				{
					first_name: '',
					last_name: '',
					email: '',
					phone: '',
					address: '',
					genderId: 'GF',
					positionId: 'DOC1',
					importStatus: IMPORT_STATUS.PREPARE,
				},
			],
		},
		resolver: yupResolver(
			yup.object().shape({
				doctors: yup.array().of(
					yup.object().shape({
						first_name: requiredValidation,
						last_name: requiredValidation,
						email: emailValidation,
						address: requiredValidation,
						phone: phoneValidation,
						genderId: yup.string().oneOf(GENDERS).required(),
						positionId: yup.string().oneOf(DOCTOR_POSITIONS).required(),
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
		insert(fields.length + 1);
	};

	const filterFailedDoctors = (doctors) => {
		return doctors.reduce((array, doctor, index) => {
			const checked = doctor.importStatus;
			if (checked !== IMPORT_STATUS.SUCCESS) {
				delete doctor.IMPORT_STATUS;
				array.push(doctor);
			} else {
				handleRemoveItem(index);
			}
			return array;
		}, []);
	};

	const updateDoctorsImportStatus = (importedDoctors) => {
		importedDoctors.forEach((insertedSuccess, index) => {
			const key = insertedSuccess ? 'SUCCESS' : 'FAIL';
			methods.setValue(`doctors.${index}.importStatus`, IMPORT_STATUS[key]);
		});
	};

	const handleUploadExcelFile = async ({ fileExcel }) => {
		const jsonData = await readFileExcel(fileExcel);
		const doctors = jsonData.map((doctor) => {
			doctor.importStatus = IMPORT_STATUS.PREPARE;
			return doctor;
		});
		methods.setValue('doctors', doctors);
	};

	const handleOnSubmit = async (data) => {
		const doctors = filterFailedDoctors(data.doctors);
		const importedDoctors = await onSubmit(doctors);
		updateDoctorsImportStatus(importedDoctors);
	};

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
										<FormattedMessage id='form.first_name' />
									</th>
									<th className='text-start'>
										<FormattedMessage id='form.last_name' />
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
										<TrStatus status={methods.getValues(`doctors.${index}.importStatus`)} key={field.id}>
											<td className='text-center'>{index + 1}</td>
											<TdInput className='text-center' name={`doctors.${index}.first_name`} />
											<TdInput className='text-center' name={`doctors.${index}.last_name`} />
											<TdInput className='text-center' name={`doctors.${index}.email`} />
											<TdInput className='text-center' name={`doctors.${index}.phone`} />
											<TdInput className='text-center' name={`doctors.${index}.address`} />
											<TdSelect data-parent='table-import-excel' options={genders} name={`doctors.${index}.genderId`} />
											<TdSelect
												data-parent='table-import-excel'
												options={positions}
												name={`doctors.${index}.positionId`}
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
					<Button size='XS' type='button' secondary onClick={onClose}>
						<FormattedMessage id='button.cancel' />
					</Button>
					<Button size='XS' type='button' success onClick={handleInsertItem}>
						<FormattedMessage id='button.add' />
					</Button>
					<Button size='XS' type='submit' onClick={methods.handleSubmit(handleOnSubmit)}>
						<FormattedMessage id='button.import' />
					</Button>
				</div>
			</BaseModalFooter>
		</BaseModal>
	);
}
