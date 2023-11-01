import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { showToastMessage } from 'utils';
import { authLogin, authLogout, authRefreshTokens, changePassword } from './authAction';

const initialState = {
	info: {
		id: '',
		email: '',
		role: '',
		firstName: '',
		lastName: '',
		image: '',
		languageId: 'en',
		theme: 'light',
	},
	tokens: {
		accessToken: null,
		refreshToken: null,
	},
	status: {
		isLogin: false,
	},
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		changeLanguage: (state, { payload }) => {
			const { languageId } = payload;
			state.info.languageId = languageId;
		},
		updateTokens: (state, { payload }) => {
			state.tokens.accessToken = payload.accessToken;
			state.tokens.refreshToken = payload.refreshToken;
		},
		updateProfile: (state, { payload }) => {
			Object.entries(payload).forEach(([key, value]) => {
				if (Object.hasOwn(state.info, key)) {
					state.info[key] = value;
				}
			});
		},
		unauthorized: (state) => {
			Object.assign(state, initialState);
		},
		toggleTheme: (state) => {
			state.info.theme = state.info.theme === 'dark' ? 'light' : 'dark';
		},
	},
	extraReducers: (builder) => {
		builder
			.addMatcher(isAnyOf(authLogin.fulfilled), (state, meta) => {
				const { account, tokens } = meta.payload.metadata;
				state.status.isLogin = true;

				state.info.id = account._id;
				state.info.email = account.email;
				state.info.firstName = account.firstName;
				state.info.lastName = account.lastName;
				state.info.role = account.role;

				state.tokens.accessToken = tokens.accessToken;
				state.tokens.refreshToken = tokens.refreshToken;
			})
			.addMatcher(isAnyOf(authRefreshTokens.fulfilled), (state, meta) => {
				const tokens = meta?.payload?.metadata || {};

				state.tokens.accessToken = tokens.accessToken || '';
				state.tokens.refreshToken = tokens.refreshToken || '';
			})
			.addMatcher(isAnyOf(authLogout.fulfilled, authLogout.fulfilled, changePassword.fulfilled), (state) => {
				state.info = initialState.info;
				state.tokens = initialState.tokens;
				state.status = initialState.status;
			})
			.addMatcher(isAnyOf(authLogin.rejected, changePassword.rejected, authLogout.rejected), (state, meta) => {
				if (meta?.payload?.message) {
					showToastMessage(meta?.payload?.message, state.info.languageId, 'warning');
				}
			});
	},
});

export const { changeLanguage, updateTokens, updateProfile, unauthorized, toggleTheme } = authSlice.actions;
export default authSlice.reducer;
