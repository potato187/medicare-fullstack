import { authLogout } from 'reduxStores/slices/auth';

export const logoutUser = (dispatch, info, tokens) => {
	dispatch(
		authLogout({
			id: info.id,
			tokens: { accessToken: `Bear ${tokens.accessToken}`, refreshToken: tokens.refreshToken },
		}),
	);
};
