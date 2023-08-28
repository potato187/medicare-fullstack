import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import { authLogin, authLogout, authRefreshTokens } from './authAction';

const initialState = {
	user: {
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
			state.languageId = languageId;
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

				state.user.id = account._id;
				state.user.email = account.email;
				state.user.firstName = account.firstName;
				state.user.lastName = account.lastName;
				state.user.role = account.role;

				state.tokens.accessToken = tokens.accessToken;
				state.tokens.refreshToken = tokens.refreshToken;
			})
			.addMatcher(isAnyOf(authRefreshTokens.fulfilled), (state, meta) => {
				const tokens = meta?.payload?.metadata || {};

				state.tokens.accessToken = tokens.accessToken;
				state.tokens.refreshToken = tokens.refreshToken;
			})
			.addMatcher(
				isAnyOf(authLogout.fulfilled, authLogin.rejected, authLogout.fulfilled, authLogout.rejected),
				(state) => {
					state.user = initialState.user;
					state.tokens = initialState.tokens;
					state.status = initialState.status;
				},
			);
	},
});

export const { changeLanguage, updateTokens } = authSlice.actions;
export default authSlice.reducer;
