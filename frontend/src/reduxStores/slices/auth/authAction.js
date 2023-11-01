import { createAsyncThunk } from '@reduxjs/toolkit';
import { HEADERS } from 'constant';
import axiosClient from '../../axiosClient';

export const authLogin = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
	try {
		const uploadBody = { email, password };
		return await axiosClient.post(`auth/login`, uploadBody);
	} catch (error) {
		return rejectWithValue(error);
	}
});

export const authLogout = createAsyncThunk('auth/logout', ({ id, tokens }, { rejectWithValue }) => {
	try {
		const { accessToken, refreshToken } = tokens;
		return axiosClient.get(`auth/logout`, {
			headers: {
				[HEADERS.CLIENT_ID]: id,
				[HEADERS.AUTHORIZATION]: accessToken,
				[HEADERS.REFRESH_TOKEN]: refreshToken,
			},
		});
	} catch (error) {
		return rejectWithValue(error);
	}
});

export const authRefreshTokens = createAsyncThunk('auth/refreshTokens', ({ id, tokens }) => {
	const { accessToken, refreshToken } = tokens;
	return axiosClient.get(`auth/refresh-tokens/${id}`, {
		headers: {
			[HEADERS.CLIENT_ID]: id,
			[HEADERS.AUTHORIZATION]: accessToken,
			[HEADERS.REFRESH_TOKEN]: refreshToken,
		},
	});
});

export const changePassword = createAsyncThunk(
	'auth/change-password',
	async ({ id, password, newPassword, tokens }, { rejectWithValue }) => {
		try {
			const { accessToken, refreshToken } = tokens;
			const body = { id, password, newPassword };
			return await axiosClient.post(`auth/change-password`, body, {
				headers: {
					[HEADERS.CLIENT_ID]: id,
					[HEADERS.AUTHORIZATION]: `Bear ${accessToken}`,
					[HEADERS.REFRESH_TOKEN]: refreshToken,
				},
			});
		} catch (error) {
			return rejectWithValue(error);
		}
	},
);
