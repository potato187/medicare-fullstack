const PORT = process.env.DEV_APP_PORT || 8080;

const server = require('./src/app').listen(PORT, () => {
	// eslint-disable-next-line no-console
	console.log(`Server is running on port:: ${PORT}.`);
});

process.on('SIGINT', () => {
	server.close(() => {
		// eslint-disable-next-line no-console
		console.log('Exit Server Database.');
	});
});
