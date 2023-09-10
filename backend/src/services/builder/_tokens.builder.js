const { ACCESS_TOKEN_EXPIRES, REFRESH_TOKEN_EXPIRES } = require('@/auth/auth.constant');
const JWT = require('jsonwebtoken');

class TokenBuilder {
	constructor() {
		this.data = {
			key: '',
			payload: {},
		};
	}

	setPayload(payload) {
		this.data.payload = payload;
		return this;
	}

	getPayload() {
		return this.data.payload;
	}

	setKey(key) {
		this.data.key = key;
		return this;
	}

	getKey() {
		return this.data.key;
	}

	async buildAccessToken(options = { expiresIn: ACCESS_TOKEN_EXPIRES }) {
		const token = await JWT.sign(this.data.payload, this.data.key, options);
		return token;
	}

	async buildRefreshToken(options = { expiresIn: REFRESH_TOKEN_EXPIRES }) {
		const token = await JWT.sign(this.data.payload, this.data.key, options);
		return token;
	}
}

module.exports = TokenBuilder;
