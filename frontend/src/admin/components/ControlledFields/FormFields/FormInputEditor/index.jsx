import { Controller, useFormContext } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Editor } from './constant';

export function FormInputEditor({ name }) {
	const { control } = useFormContext();

	return (
		<Controller
			name={name}
			control={control}
			defaultValue=''
			render={({ field }) => <ReactQuill theme='snow' modules={Editor.modules} formats={Editor.formats} {...field} />}
		/>
	);
}
