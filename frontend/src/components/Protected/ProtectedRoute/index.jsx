import { useAuth } from 'hooks';
import React from 'react';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ redirectPath = '../login', children }) {
	const { status } = useAuth();

	if (!status.isLogin) {
		return <Navigate to={redirectPath} replace />;
	}

	return children;
}
