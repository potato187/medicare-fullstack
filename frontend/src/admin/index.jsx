import 'admin/styles/style.scss';
import { IntlProviderWrapper } from 'hocs';
import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import 'shared/styles/style.scss';
import { AuthLanguagesProvider } from 'stores';
import { BaseNotification, Layout } from './components';
import { Preloader } from './components/Loader';
import { withAuth } from './hocs';
import { persistor, store } from './redux/store/configureStore';
import {
	LazyAdminManager,
	LazyBlogCategoryManager,
	LazyBlogsManager,
	LazyBookingManager,
	LazyFooterManager,
	LazyHeaderManager,
	LazyHtmlContentManager,
	LazyLanguageManager,
	LazyLoginPage,
	LazyNewsManager,
	LazySettingConfigManager,
	LazySpecialtyManager,
} from './lazyComponents';

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
										<Route path=':languageId' element={<LazyLanguageManager />} />
										<Route path='*' element={<Navigate to='en' replace />} />
									</Route>
									<Route path='admin/*'>
										<Route path='manage' element={<LazyAdminManager />} />
										<Route path='*' element={<Navigate to='manage' replace />} />
									</Route>
									<Route path='specialty/*'>
										<Route path='manage' element={<LazySpecialtyManager />} />
										<Route path='*' element={<Navigate to='manage' replace />} />
									</Route>
									<Route path='booking/*'>
										<Route path='manage' element={<LazyBookingManager />} />
										<Route path='*' element={<Navigate to='manage' replace />} />
									</Route>

									<Route path='blogs/*'>
										<Route path='categories' element={<LazyBlogCategoryManager />} />
										<Route path='news' element={<LazyNewsManager />} />
										<Route path='manage' element={<LazyBlogsManager />} />
										<Route path='*' element={<Navigate to='manage' replace />} />
									</Route>

									<Route path='modules/*'>
										<Route path='setting' element={<LazySettingConfigManager />} />
										<Route path='header' element={<LazyHeaderManager />} />
										<Route path='footer' element={<LazyFooterManager />} />
										<Route path='html_content' element={<LazyHtmlContentManager />} />
										<Route path='*' element={<Navigate to='manage' replace />} />
									</Route>
								</Route>
								<Route path='login' element={<LazyLoginPage />} />
							</Routes>
						</PersistGate>
					</IntlProviderWrapper>
				</AuthLanguagesProvider>
			</Provider>
			<BaseNotification />
		</>
	);
}
