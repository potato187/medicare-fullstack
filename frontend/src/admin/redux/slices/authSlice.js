import { authService } from '@/admin/service';
import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';

const initialState = {
	payload: {
		id: '',
		email: '',
		role_key: '',
		firstName: '',
		lastName: '',
		image: '',
		accessToken: null,
		refreshToken: null,
	},
	isLoading: false,
	isSuccess: false,
	isLogin: false,
	languageId: 'en',
};

export const authLogin = createAsyncThunk('auth/login', async ({ email, password }) => {
	return await authService.login({ email, password });
});

export const authLogout = createAsyncThunk('auth/logout', async () => {
	return await authService.logout();
});

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		changeLanguage: (state, { payload }) => {
			const { languageId } = payload;
			state.languageId = languageId;
		},
		authRefreshTokens: (state, { payload }) => {
			state.payload.accessToken = payload.accessToken;
			state.payload.refreshToken = payload.refreshToken;
		},
	},
	extraReducers: (builder) => {
		builder
			.addMatcher(isAnyOf(authLogin.pending, authLogout.pending), (state) => {
				state.isLoading = true;
			})
			.addMatcher(isAnyOf(authLogin.fulfilled), (state, meta) => {
				const { admin, tokens } = meta.payload.metadata;
				state.isLoading = false;
				state.isLogin = true;
				state.isSuccess = true;
				state.payload.id = admin._id;
				state.payload.email = admin.email;
				state.payload.firstName = admin.firstName;
				state.payload.lastName = admin.lastName;
				state.payload.role = admin.role;
				state.payload.accessToken = tokens.accessToken;
				state.payload.refreshToken = tokens.refreshToken;
			})
			.addMatcher(isAnyOf(authLogin.rejected, authLogout.fulfilled, authLogout.rejected), (state) => {
				state.isLoading = false;
				state.isSuccess = false;
				state.isLogin = false;
				state.payload = { ...initialState.payload };
			});
	},
});

export const { changeLanguage, authRefreshTokens } = authSlice.actions;
export default authSlice.reducer;
