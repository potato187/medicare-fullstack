import { yupResolver } from '@hookform/resolvers/yup';
import { languageApi } from 'admin/api';
import {
	Breadcrumb,
	Button,
	Container,
	ContainerMain,
	ContainerTitle,
	FloatingInput,
	WrapScrollBar,
} from 'admin/components';
import { showToastMessage, tryCatchAndToast } from 'admin/utilities';
import React, { useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';
import { useLanguages } from 'stores';
import * as yup from 'yup';
import { convertData, convertName } from '../../utilities';

export default function LanguageManager() {
	const { languageId = '' } = useParams();
	const { languages, validationForm, updateLanguage } = useLanguages();
	const language = useMemo(() => convertData(languages[languageId]), [languages, languageId]);

	const methods = useForm({
		mode: 'onChange',
		resolver: yupResolver(yup.object().shape({ ...validationForm })),
	});

	const handleOnSubmit = tryCatchAndToast(async (data) => {
		const { metadata, message } = await languageApi.updateLanguageById({ languageId, body: data });
		updateLanguage(languageId, metadata);
		showToastMessage(message, languageId);
	}, languageId);

	useEffect(() => {
		Object.entries(language).forEach(([prefix, { fields }]) => {
			Object.keys(fields).forEach((key) => {
				methods.setValue(`${prefix}.${key}`, fields[key]);
			});
		});
	}, [languageId, methods, language]);

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
							<Button type='submit' size='xs' onClick={methods.handleSubmit(handleOnSubmit)}>
								<FormattedMessage id='button.update' />
							</Button>
						</div>
					</form>
				</WrapScrollBar>
			</Container>
		</FormProvider>
	);
}
