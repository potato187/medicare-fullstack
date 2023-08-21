'use strict';
const { CreatedResponse, OkResponse } = require('@/core');
const { AccessService } = require('@/services');

class AccessController {
	signUp = async (req, res, next) => {
		new CreatedResponse({
			code: 200201,
			metadata: await AccessService.singUp(req.body),
		}).send(req, res);
	};

	login = async (req, res, next) => {
		new OkResponse({
			metadata: await AccessService.login(req.body),
		}).send(req, res);
	};

	logout = async (req, res, next) => {
		new OkResponse({
			metadata: await AccessService.logout(req.keyStore),
		}).send(req, res);
	};
}

module.exports = new AccessController();
