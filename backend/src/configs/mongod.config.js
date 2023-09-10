const DEV = {
	app: {
		port: process.env.DEV_APP_PORT || 8080,
	},
	db: {
		host: process.env.DEV_DB_HOST || '127.0.0.1',
		port: process.env.DEV_DB_PORT || 27107,
		name: process.env.DEV_DB_NAME || '',
	},
};

const PRODUCT = {
	app: {
		port: process.env.PRODUCT_APP_PORT || 8080,
	},
	db: {
		host: process.env.PRODUCT_DB_HOST || '127.0.0.1',
		port: process.env.PRODUCT_DB_PORT || 27107,
		name: process.env.PRODUCT_DB_NAME || '',
	},
};

const configs = { DEV, PRODUCT };
module.exports = configs[process.env.NODE_ENV];
