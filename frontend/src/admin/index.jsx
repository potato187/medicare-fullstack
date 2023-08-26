import { IntlProviderWrapper } from 'hocs';
import React from 'react';
import { Provider } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { AuthLanguagesProvider } from 'stores';
import { withAuth } from './hocs';
import { BaseNotification, Layout } from './components';
import { AdminManager, LanguageManager, LoginPage, SpecialtyManager } from './features';
import { persistor, store } from './redux/store/configureStore';
import 'shared/styles/style.scss';
import 'admin/styles/style.scss';

const ProtectedRoute = withAuth(Layout);

export default function Admin() {
	return (
		<>
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
									<Route path='specialty/*'>
										<Route path='manage' element={<SpecialtyManager />} />
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
		</>
	);
}
