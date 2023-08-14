'use strict';
const app = require('@/app');
const PORT = process.env.DEV_APP_PORT || 8080;

const server = app.listen(PORT, () => {
	console.log(`Server is running on port:: ${PORT}.`);
});

process.on('SIGINT', () => {
	server.close(() => {
		console.log('Exit Server Database.');
	});
});
