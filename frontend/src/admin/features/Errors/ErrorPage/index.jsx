import { useRouteError } from 'react-router-dom';

export function ErrorPage() {
	const error = useRouteError();
	// eslint-disable-next-line no-console
	console.error(error);
	return <div>Error</div>;
}
