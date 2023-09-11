import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { showToastMessage } from 'admin/utilities';
import { authLogin, authLogout, authRefreshTokens } from './authAction';

const initialState = {
	info: {
		id: '',
		email: '',
		role: '',
		firstName: '',
		lastName: '',
		image: '',
		languageId: 'en',
	},
	tokens: {
		accessToken: null,
		refreshToken: null,
	},
	status: {
		isLoading: false,
		isSuccess: false,
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
	},
	extraReducers: (builder) => {
		builder
			.addMatcher(isAnyOf(authLogin.pending, authLogout.pending, authRefreshTokens.pending), (state) => {
				state.isLoading = true;
			})
			.addMatcher(isAnyOf(authLogin.fulfilled), (state, meta) => {
				const { account, tokens } = meta.payload.metadata;
				state.status.isLoading = false;
				state.status.isLogin = true;
				state.status.isSuccess = true;

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

				state.tokens.accessToken = tokens.accessToken;
				state.tokens.refreshToken = tokens.refreshToken;
			})
			.addMatcher(isAnyOf(authLogin.rejected, authLogout.fulfilled, authLogout.rejected), (state) => {
				state.info = initialState.info;
				state.tokens = initialState.tokens;
				state.status = initialState.status;
			})
			.addMatcher(isAnyOf(authLogin.rejected), (state, meta) => {
				const {
					payload: { message },
				} = meta;
				showToastMessage(message, state.info.languageId, 'warning');
			});
	},
});

export const { changeLanguage, updateTokens } = authSlice.actions;
export default authSlice.reducer;
