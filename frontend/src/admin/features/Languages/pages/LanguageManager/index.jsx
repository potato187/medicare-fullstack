import {
	Button,
	Container,
	ContainerMain,
	ContainerTitle,
	FloatingInput,
	Breadcrumb,
	WrapScrollBar,
} from '@/admin/components';
import { useLanguages } from '@/store';
import React, { useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { convertData, convertName } from '../../utilities';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { languageApi } from '@/admin/api';

export function LanguageManager() {
	const { languageId = '' } = useParams();
	const { languages, validationForm, updateLanguage } = useLanguages();
	const language = useMemo(() => convertData(languages[languageId]), [languages, languageId]);

	const methods = useForm({
		mode: 'onChange',
		resolver: yupResolver(yup.object().shape(validationForm)),
	});

	const handleOnSubmit = async (data) => {
		try {
			const { data: dataResponse, message } = await languageApi.updateLanguageById({ languageId, data });
			updateLanguage(languageId, dataResponse);
			toast.success(message[languageId]);
		} catch (error) {
			toast.error(error.message[languageId]);
		}
	};

	useEffect(() => {
		methods.clearErrors();
		Object.entries(language).map(([prefix, { fields }]) => {
			for (const key in fields) {
				methods.setValue(`${prefix}.${key}`, fields[key]);
			}
		});
	}, [languageId]);

	return (
		<FormProvider {...methods}>
			<Container noPadding>
				<WrapScrollBar>
					<form onSubmit={methods.handleSubmit(handleOnSubmit)}>
						{Object.entries(language).map(([key, { breadcrumb, fields }]) => (
							<React.Fragment key={key}>
								<ContainerTitle>
									<Breadcrumb breadcrumb={breadcrumb}>
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
										{Object.keys(fields).map((name) => (
											<div className='col-3 mb-6' key={`${key}.${name}`}>
												<FloatingInput name={`${key}.${name}`} label={convertName(name)} />
											</div>
										))}
									</div>
								</ContainerMain>
							</React.Fragment>
						))}
						<div className='p-5 text-center'>
							<Button size='sm' isLoading={methods.formState.isSubmitting}>
								<FormattedMessage id='button.update' />
							</Button>
						</div>
					</form>
				</WrapScrollBar>
			</Container>
		</FormProvider>
	);
}
