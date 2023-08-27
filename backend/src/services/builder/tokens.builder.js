'use strict';
const { UnauthorizedRequestError } = require('@/core');
const JWT = require('jsonwebtoken');

class TokenBuilder {
	constructor() {
		this.data = {
			token: '',
			key: '',
			payload: {},
		};
	}

	setPayload(payload) {
		this.data.payload = { ...this.data.payload, ...payload };
		return this;
	}

	setToken(token) {
		this.data.token = token;
		return this;
	}

	getToken() {
		return this.data.token;
	}

	setKey(key) {
		this.data.key = key;
		return this;
	}

	getKey() {
		return this.data.key;
	}

	async verifyToken() {
		let payload = {};
		let errorCode = 0;

		try {
			const { userId, role } = await JWT.verify(this.data.token, this.data.key);

			if (this.data.payload.userId !== userId) {
				errorCode = 100401;
			}

			Object.assign(payload, { userId, role });
		} catch (error) {
			errorCode = error.name !== 'TokenExpiredError' ? 100401 : 101401;
		}

		return { payload, errorCode };
	}

	async build({ expiresIn = '3 days' }) {
		return await JWT.sign(this.data.payload, this.data.key, { expiresIn });
	}
}

module.exports = TokenBuilder;
