'use strict';
const { CreatedResponse, OkResponse } = require('@/core');
const { AccessService } = require('@/services');

class AccessController {
	signUp = async (req, res, next) => {
		new CreatedResponse({
			code: 200201,
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

	handleRefreshToken = async (req, res, next) => {
		new CreatedResponse({
			metadata: await AccessService.handleRefreshToken({
				user: req.user,
				keyStore: req.keyStore,
				refreshToken: req.body.refreshToken,
			}),
		}).send(res);
	};
}

module.exports = new AccessController();
