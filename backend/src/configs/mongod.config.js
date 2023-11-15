const DEV = {
	app: {
		port: process.env.DEV_APP_PORT,
	},
	db: {
		user: process.env.DEV_DB_USER,
		password: process.env.DEV_DB_PASSWORD,
		host: process.env.DEV_DB_HOST,
		port: process.env.DEV_DB_PORT,
		name_db: process.env.DEV_DB_NAME,
	},
};

const PRODUCT = {
	app: {
		port: process.env.PRODUCT_APP_PORT,
	},
	db: {
		user: process.env.PRODUCT_DB_USER,
		password: process.env.PRODUCT_DB_PASSWORD,
		host: process.env.PRODUCT_DB_HOST,
		port: process.env.PRODUCT_DB_PORT,
		name_db: process.env.PRODUCT_DB_NAME,
	},
};

const configs = { DEV, PRODUCT };
module.exports = configs[process.env.NODE_ENV];
