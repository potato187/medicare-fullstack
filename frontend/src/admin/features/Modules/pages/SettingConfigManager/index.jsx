import { yupResolver } from '@hookform/resolvers/yup';
import { settingConfigApi } from 'admin/api';
import {
	Breadcrumb,
	Button,
	Container,
	ContainerMain,
	ContainerTitle,
	FloatingInput,
	WrapScrollBar,
} from 'admin/components';
import { convertName } from 'admin/features/Languages/utilities';
import { showToastMessage, tryCatch, tryCatchAndToast } from 'admin/utilities';
import { useAuth } from 'hooks';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { settingConfigSchema } from './validation';

export function SettingConfigManager() {
	const {
		info: { languageId },
	} = useAuth();

	const [configs, setConfigs] = useState({});
	const methods = useForm({
		mode: 'onChange',
		resolver: yupResolver(settingConfigSchema),
	});

	const handleOnSubmit = tryCatchAndToast(async (data) => {
		const cloneObj = JSON.parse(JSON.stringify(configs));
		Object.entries(data).forEach(([key, fields]) => {
			Object.entries(fields).forEach(([name, value]) => {
				cloneObj[key][name].value = value;
			});
		});

		const { message, metadata } = await settingConfigApi.updateConfig(cloneObj);
		setConfigs(metadata);
		showToastMessage(message, languageId);
	}, languageId);

	useEffect(() => {
		tryCatch(async () => {
			const { metadata } = await settingConfigApi.getConfig();
			setConfigs(metadata);
		})();
	}, []);

	useEffect(() => {
		const keys = Object.keys(configs);
		if (keys.length) {
			keys.forEach((key) => {
				Object.entries(configs[key]).forEach(([name, { value }]) => {
					methods.setValue(`${key}.${name}`, value);
				});
			});
		}
	}, [configs, methods]);

	return (
		<Container id='page-main'>
			<FormProvider {...methods}>
				<WrapScrollBar>
					<form>
						{Object.entries(configs).map(([key, fields]) => (
							<React.Fragment key={key}>
								<ContainerTitle>
									<Breadcrumb breadcrumb={[key]}>
										{(item, index) => (
											<li key={index}>
												<span>
													<span>{convertName(item)}</span>
												</span>
											</li>
										)}
									</Breadcrumb>
								</ContainerTitle>
								<ContainerMain>
									<div className='row'>
										{Object.entries(fields).map(([name, { type, label }]) => (
											<div className='col-4 mb-6' key={name}>
												<FloatingInput type={type} name={`${key}.${name}`} label={label} />
											</div>
										))}
									</div>
								</ContainerMain>
							</React.Fragment>
						))}
						<div className='p-5 text-center'>
							<Button type='submit' size='xs' onClick={methods.handleSubmit(handleOnSubmit)}>
								<FormattedMessage id='button.update' />
							</Button>
						</div>
					</form>
				</WrapScrollBar>
			</FormProvider>
		</Container>
	);
}
