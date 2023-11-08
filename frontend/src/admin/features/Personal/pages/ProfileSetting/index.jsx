import { adminApi, resourceApi } from 'api';
import { Container, ContainerMain, TabNav, TabNavItem, TabPanel, Tabs, WrapScrollBar } from 'components';
import { useAuth } from 'hooks';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { changePassword, unauthorized, updateProfile } from 'reduxStores/slices/auth';
import { showToastMessage, tryCatch, tryCatchAndToast } from 'utils';
import { ChangePassForm, ProfileForm } from '../../components';

export default function ProfileSetting() {
	const dispatch = useDispatch();
	const { info, tokens } = useAuth();
	const { languageId, id } = info;
	const [genders, setGenders] = useState([]);
	const Genders = useMemo(() => {
		return genders.map(({ key, name }) => ({ label: name[languageId], value: key }));
	}, [genders, languageId]);

	const handleUpdate = tryCatchAndToast(async (data) => {
		const { message, metadata } = await adminApi.updateById(id, data);
		if (Object.keys(metadata).length) {
			if (metadata.email && info.email !== metadata.email) {
				dispatch(unauthorized());
			} else {
				dispatch(updateProfile(metadata));
			}
		}

		showToastMessage(message, languageId);
	}, languageId);

	const handleChangePassword = (data) => {
		const { password, newPassword } = data;
		dispatch(changePassword({ id, password, newPassword, tokens: { ...tokens } }));
	};

	useEffect(() => {
		tryCatch(async () => {
			const { metadata } = await resourceApi.getAll({
				model: 'gender',
			});
			setGenders(metadata);
		})();
	}, []);

	return (
		<Container id='page-main'>
			<WrapScrollBar>
				<Tabs tabIndexActive={0}>
					<TabNav variant='bordered'>
						<TabNavItem labelIntl='form.profile' index={0} />
					</TabNav>
					<TabPanel tabPanelIndex={0}>
						<ContainerMain>
							<ProfileForm profileId={id} genders={Genders} onSubmit={handleUpdate} />
						</ContainerMain>
					</TabPanel>
				</Tabs>
				<Tabs tabIndexActive={0}>
					<TabNav variant='bordered'>
						<TabNavItem labelIntl='form.change_password' index={0} />
					</TabNav>
					<TabPanel tabPanelIndex={0}>
						<ContainerMain className='border-0'>
							<ChangePassForm onSubmit={handleChangePassword} />
						</ContainerMain>
					</TabPanel>
				</Tabs>
			</WrapScrollBar>
		</Container>
	);
}
