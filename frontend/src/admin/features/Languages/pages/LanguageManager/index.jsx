import { yupResolver } from '@hookform/resolvers/yup';
import { languageApi } from 'api';
import { Breadcrumb, Button, Container, ContainerMain, ContainerTitle, FloatingInput, WrapScrollBar } from 'components';
import { useAuth } from 'hooks';
import React, { useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';
import { useLanguages } from 'stores';
import { showToastMessage, tryCatchAndToast } from 'utils';
import * as yup from 'yup';
import { convertData, convertName } from '../../utils';

export default function LanguageManager() {
	const { languageId = 'en' } = useParams();
	const { info } = useAuth();
	const { languages, validationForm, updateLanguage } = useLanguages();
	const language = useMemo(() => convertData(languages[languageId]), [languages, languageId]);

	const methods = useForm({
		mode: 'onChange',
		resolver: yupResolver(yup.object().shape({ ...validationForm })),
	});

	const handleUpdate = tryCatchAndToast(async (data) => {
		const { metadata, message } = await languageApi.updateLanguageById({ languageId, body: data });
		updateLanguage(languageId, metadata);
		showToastMessage(message, info.languageId);
	}, languageId);

	useEffect(() => {
		Object.entries(language).forEach(([prefix, { fields }]) => {
			Object.keys(fields).forEach((key) => {
				methods.setValue(`${prefix}.${key}`, fields[key]);
			});
		});
	}, [languageId, language]);

	return (
		<FormProvider {...methods}>
			<Container noPadding>
				<WrapScrollBar>
					<form onSubmit={methods.handleSubmit(handleUpdate)}>
						{Object.entries(language).map(([key, { breadcrumb, fields }]) => (
							<React.Fragment key={key}>
								<ContainerTitle>
									<Breadcrumb wrap breadcrumb={breadcrumb}>
										{(item, index) => (
											<li key={index}>
												<span className='text-nowrap'>
													<span>{convertName(item)}</span>
												</span>
											</li>
										)}
									</Breadcrumb>
								</ContainerTitle>
								<ContainerMain>
									<div className='row'>
										{Object.keys(fields).map((name) => (
											<div className='col-12 col-sm-6 col-lg-4 col-xl-3 mb-6' key={`${key}.${name}`}>
												<FloatingInput name={`${key}.${name}`} label={convertName(name)} />
											</div>
										))}
									</div>
								</ContainerMain>
							</React.Fragment>
						))}
						<div className='p-5 text-center'>
							<Button type='submit' size='xs' onClick={methods.handleSubmit(handleUpdate)}>
								<FormattedMessage id='button.update' />
							</Button>
						</div>
					</form>
				</WrapScrollBar>
			</Container>
		</FormProvider>
	);
}
