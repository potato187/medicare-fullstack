const PORT = process.env.PRODUCT_APP_PORT || 8080;

const server = require('./app').listen(PORT, () => {
	// eslint-disable-next-line no-console
	console.log(`Server is running on port:: ${PORT}.`);
});

process.on('SIGINT', () => {
	server.close(() => {
		// eslint-disable-next-line no-console
		console.log('Exit Server Database.');
	});
});
