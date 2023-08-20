import { authApi } from '@/admin/api';
import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

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

export const authLogin = createAsyncThunk('auth/authLogin', async ({ email, password }) => {
	return await authApi.login({ email, password });
});

export const authLoginStatus = createAsyncThunk('auth/authLoginStatus', async () => {
	return await authApi.loginStatus();
});

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logout: (state) => {
			state.payload = { ...initialState.payload };
			state.isLoading = false;
			state.isSuccess = false;
			state.isLogin = false;
		},
		changeLanguage: (state, { payload }) => {
			const { languageId } = payload;
			state.languageId = languageId;
		},
	},
	extraReducers: (builder) => {
		builder
			.addMatcher(isAnyOf(authLogin.pending, authLoginStatus.pending), (state) => {
				state.isLoading = true;
			})
			.addMatcher(isAnyOf(authLogin.fulfilled, authLoginStatus.fulfilled), (state, meta) => {
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
			.addMatcher(isAnyOf(authLogin.rejected, authLoginStatus.rejected), (state, meta) => {
				state.isLoading = false;
				state.isSuccess = false;
				state.isLogin = false;
				state.payload = { ...initialState.payload };
			});
	},
});

export const { logout, changeLanguage } = authSlice.actions;
export default authSlice.reducer;
