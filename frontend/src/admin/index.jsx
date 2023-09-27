import 'admin/styles/style.scss';
import { IntlProviderWrapper } from 'hocs';
import { Provider } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import 'shared/styles/style.scss';
import { AuthLanguagesProvider } from 'stores';
import { BaseNotification, Layout } from './components';
import {
	AdminManager,
	BlogCategoryManager,
	BlogsManager,
	BookingManager,
	FooterManager,
	HeaderManager,
	HtmlContentManager,
	LanguageManager,
	LoginPage,
	SpecialtyManager,
} from './features';
import { persistor, store } from './redux/store/configureStore';
import { withAuth } from './hocs';

export default function Admin() {
	const ProtectedRoute = withAuth(Layout);
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
									<Route path='booking/*'>
										<Route path='manage' element={<BookingManager />} />
										<Route path='*' element={<Navigate to='manage' replace />} />
									</Route>

									<Route path='blogs/*'>
										<Route path='categories' element={<BlogCategoryManager />} />
										<Route path='manage' element={<BlogsManager />} />
										<Route path='*' element={<Navigate to='manage' replace />} />
									</Route>

									<Route path='modules/*'>
										<Route path='header' element={<HeaderManager />} />
										<Route path='footer' element={<FooterManager />} />
										<Route path='html_content' element={<HtmlContentManager />} />
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
