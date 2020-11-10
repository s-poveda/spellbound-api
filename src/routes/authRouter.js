const express = require('express');
const AuthService = require('../services/AuthService');

const jsonBodyParser = express.json();
const authRouter = express.Router();

authRouter.route('/login').post(jsonBodyParser, async (req, res, next) => {
	try {
		console.log(req.body);
		let { username, password } = req.body;
		const dbUserData = await AuthService.getUserByUsername(
			req.app.get('db'),
			username
		);
		if (!dbUserData) return res.send({ error: 'Invalid username and password combination.' });

		const pwdMatch = await AuthService.comparePwdToHash(password, dbUserData.password);
		console.log(dbUserData);
		if(!pwdMatch) return res.send({ error: 'Invalid username and password combination.' });
		const payload = { user_id: dbUserData };

		res.json({
			authToken: AuthService.createJwt(username, payload),
		});
	} catch (e) {
		next(e, req, res, next);
	}
});

authRouter.route('/signup').post(async (req, res, next) => {
	res.json();
});

module.exports = authRouter;
