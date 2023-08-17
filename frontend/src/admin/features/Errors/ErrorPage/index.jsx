import { useRouteError } from 'react-router-dom';

export function ErrorPage() {
	let error = useRouteError();
	console.error(error);
	return <div>Error</div>;
}
