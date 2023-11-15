const mongoose = require('mongoose');
const { mongodConfig } = require('@/configs');

const { db } = mongodConfig;
const { host = '', port = '', name_db = '', user = '', password = '' } = db;
const connectURI = `mongodb://${user}:${password}@${host}:${port}/${name_db}?authSource=admin`;

class Database {
	constructor() {
		this.connect();
	}

	// eslint-disable-next-line class-methods-use-this
	connect() {
		if (process.env.NODE_ENV === 'dev') {
			mongoose.set('debug', true);
			mongoose.set('debug', { color: true });
		}

		mongoose
			.connect(connectURI, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			})
			.then(() => {
				// eslint-disable-next-line no-console
				console.log('Database Connected MongoDB Success.');
			})
			.catch((err) => {
				// eslint-disable-next-line no-console
				console.error('Error connecting to MongoDB:', err);
			});
	}

	static getInstance() {
		if (!Database.instance) {
			Database.instance = new Database();
		}

		return Database.instance;
	}
}

module.exports = Database;
