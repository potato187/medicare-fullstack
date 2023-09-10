import { createAsyncThunk } from '@reduxjs/toolkit';
import { HEADERS } from 'admin/constant';
import axiosClient from '../../axiosClient';

export const authLogin = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
	try {
		const uploadBody = { email, password };
		return await axiosClient.post(`auth/login`, uploadBody);
	} catch (error) {
		return rejectWithValue(error);
	}
});

export const authLogout = createAsyncThunk('auth/logout', async ({ id, tokens }) => {
	const { accessToken, refreshToken } = tokens;
	return axiosClient.get(`auth/logout`, {
		headers: {
			[HEADERS.CLIENT_ID]: id,
			[HEADERS.AUTHORIZATION]: accessToken,
			[HEADERS.REFRESH_TOKEN]: refreshToken,
		},
	});
});

export const authRefreshTokens = createAsyncThunk(`auth/refreshTokens`, async ({ id, tokens }) => {
	const { accessToken, refreshToken } = tokens;
	return axiosClient.get(`auth/refresh-tokens/${id}`, {
		headers: {
			[HEADERS.CLIENT_ID]: id,
			[HEADERS.AUTHORIZATION]: accessToken,
			[HEADERS.REFRESH_TOKEN]: refreshToken,
		},
	});
});
