const express = require('express');
const AuthService = require('../services/AuthService');

const jsonBodyParser = express.json();
const authRouter = express.Router();

authRouter.route('/login').post(jsonBodyParser, async (req, res, next) => {
	try {
		let { username, password } = req.body;
		const dbUserData = await AuthService.getUserByUsername(
			req.app.get('db'),
			username
		);
		if (!dbUserData) return res.status(401).send({ error: 'Invalid username and password combination.' });

		const pwdMatch = await AuthService.comparePwdToHash(password, dbUserData.password);
		if(!pwdMatch) return res.status(401).send({ error: 'Invalid username and password combination.' });
		const payload = { user_id: dbUserData.id };

		res.json({
			authToken: AuthService.createJwt(username, payload),
		});
	} catch (e) {
		next(e, req, res, next);
	}
});

authRouter.route('/signup').post(jsonBodyParser, async (req, res, next) => {
	try {
		let { username, password } = req.body;
		const dbUserData = await AuthService.getUserByUsername(
			req.app.get('db'),
			username
		);

		if (dbUserData) return res.status(409).send({ message: 'Username is already in use.' });

		await AuthService.insertNewUser(
			req.app.get('db'),
			username,
			password
		);
		res.sendStatus(204);
	} catch (e) {

		next(e);
	}
});

module.exports = authRouter;
