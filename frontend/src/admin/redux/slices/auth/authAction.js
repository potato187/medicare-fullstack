import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from 'admin/redux/axiosClient';

export const authLogin = createAsyncThunk('auth/login', async ({ email, password }) => {
	const uploadBody = { email, password };
	return await axiosClient.post('auth/login', uploadBody);
});

export const authLogout = createAsyncThunk('auth/logout', async () => {
	return await axiosClient.get('auth/logout');
});

export const authRefreshTokens = createAsyncThunk('auth/refreshTokens', async (id) => {
	return await axiosClient.get(`auth/refresh-tokens/${id}`);
});
