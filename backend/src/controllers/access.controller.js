/* eslint-disable no-unused-vars */
const { HEADERS } = require('@/constant');
const { CreatedResponse, OkResponse } = require('@/core');
const { tryCatch } = require('@/middleware');
const { AccessService } = require('@/services');

class AccessController {
	signUp = tryCatch(async (req, res, next) => {
		new CreatedResponse({
			metadata: await AccessService.singUp(req.body),
		}).send(res);
	});

	login = tryCatch(async (req, res, next) => {
		new OkResponse({
			metadata: await AccessService.login(req.body),
		}).send(res);
	});

	logout = tryCatch(async (req, res, next) => {
		new OkResponse({
			metadata: await AccessService.logout(req.keyStore),
		}).send(res);
	});

	refreshTokens = tryCatch(async (req, res, next) => {
		new OkResponse({
			metadata: await AccessService.refreshTokens({
				clientId: req.params.id,
				refreshToken: req.headers[HEADERS.REFRESH_TOKEN],
			}),
		}).send(res);
	});
}

module.exports = new AccessController();
