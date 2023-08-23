import '@/admin/styles/style.scss';
import { IntlProviderWrapper } from '@/hocs';
import { BaseNotification } from '@/shared/components';
import '@/shared/styles/style.scss';
import { AuthLanguagesProvider } from '@/store';
import React from 'react';
import { Provider } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { withAuth } from './hocs';
import { Layout } from './components';
import { AdminManager, LanguageManager, LoginPage } from './features';
import { persistor, store } from './redux/store/configureStore';

const ProtectedRoute = withAuth(Layout);

export default function Admin() {
	return (
		<React.Fragment>
			<Provider store={store}>
				<AuthLanguagesProvider>
					<IntlProviderWrapper>
						<PersistGate loading={null} persistor={persistor}>
							<Routes>
								<Route path='dashboard/*' element={<ProtectedRoute />}>
									<Route path='languages'>
										<Route path=':languageId' element={<LanguageManager />} />
										<Route path='*' element={<Navigate to='en' replace />} />
									</Route>
									<Route path='admin/*'>
										<Route path='manage' element={<AdminManager />} />
										<Route path='*' element={<Navigate to='manage' replace />} />
									</Route>
								</Route>
								<Route path='login' element={<LoginPage />} />
							</Routes>
						</PersistGate>
					</IntlProviderWrapper>
				</AuthLanguagesProvider>
			</Provider>
			<BaseNotification />
		</React.Fragment>
	);
}
