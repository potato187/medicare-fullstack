'use strict';
const { HEADERS } = require('@/constant');
const { CreatedResponse, OkResponse } = require('@/core');
const { AccessService } = require('@/services');

class AccessController {
	signUp = async (req, res, next) => {
		new CreatedResponse({
			metadata: await AccessService.singUp(req.body),
		}).send(res);
	};

	login = async (req, res, next) => {
		new OkResponse({
			metadata: await AccessService.login(req.body),
		}).send(res);
	};

	logout = async (req, res, next) => {
		new OkResponse({
			metadata: await AccessService.logout(req.keyStore),
		}).send(res);
	};

	refreshTokens = async (req, res, next) => {
		new OkResponse({
			metadata: await AccessService.refreshTokens({
				clientId: req.params.id,
				refreshToken: req.headers[HEADERS.REFRESH_TOKEN],
			}),
		}).send(res);
	};
}

module.exports = new AccessController();
