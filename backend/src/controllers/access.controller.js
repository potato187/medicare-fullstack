'use strict';
const { CreatedResponse } = require('@/core');
const { AccessService } = require('@/services');

class AccessController {
	signUp = async (req, res, next) => {
		new CreatedResponse({
			message: 'Registered Ok!',
			metadata: await AccessService.singUp(req.body),
		}).send(res);
	};

	login = async (req, res, next) => {
		new CreatedResponse({
			message: 'Login successfully!',
			metadata: await AccessService.login(req.body),
		}).send(res);
	};

	logout = async (req, res, next) => {
		new CreatedResponse({
			message: 'Logout successfully!',
			metadata: await AccessService.logout(req.keyStore),
		}).send(res);
	};
}

module.exports = new AccessController();
