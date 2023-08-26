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
				const { admin, tokens } = meta.payload.metadata;
				state.status.isLoading = false;
				state.status.isLogin = true;
				state.status.isSuccess = true;

				state.user.id = admin._id;
				state.user.email = admin.email;
				state.user.firstName = admin.firstName;
				state.user.lastName = admin.lastName;
				state.user.role = admin.role;

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
