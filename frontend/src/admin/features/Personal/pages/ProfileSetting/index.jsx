import { adminApi, resourceApi } from 'admin/api';
import { Container, ContainerMain, TabNav, TabNavItem, TabPanel, Tabs } from 'admin/components';
import { changePassword, updateProfile } from 'admin/redux/slices/auth';
import { showToastMessage, tryCatch, tryCatchAndToast } from 'admin/utilities';
import { useAuth } from 'hooks';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ChangePassForm, ProfileForm } from './components';

export default function ProfileSetting() {
	const {
		info: { languageId, id },
		tokens,
	} = useAuth();
	const dispatch = useDispatch();
	const [genders, setGenders] = useState([]);
	const Genders = useMemo(() => {
		return genders.map(({ key, name }) => ({ label: name[languageId], value: key }));
	}, [genders, languageId]);

	const handleUpdate = tryCatchAndToast(async (data) => {
		if (Object.keys(data).length) {
			const { message, metadata } = await adminApi.updateById(id, data);
			dispatch(updateProfile(metadata));
			showToastMessage(message, languageId);
		}
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
		</Container>
	);
}
