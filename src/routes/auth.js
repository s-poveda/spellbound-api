const express = require('express');
const xss = require('xss');
const AuthService = require('../services/AuthService');
const requireAuth = require('../middleware/requireAuth');

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
		next(e);
	}
});

authRouter.route('/signup').post(jsonBodyParser, async (req, res, next) => {
	try {
		const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/
		let { username, password } = req.body;
		//sanitize usrname and pwd before doing anything with them
		username = xss(username);
		password = xss(password);
		const dbUserData = await AuthService.getUserByUsername(
			req.app.get('db'),
			username
		);

		if (dbUserData) return res.status(409).send({ message: 'Username is already in use.' });
		if (password.length < 8 || password.length > 72) return res.status(400).json({ message: 'Password must be between 8 and 72 characters long'});
		if(!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) return res.status(400).json({ message: 'Password must contain at least one of: Uppercase, lowercase, number, special character' });

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

authRouter.route('/refresh').
get( async (req, res, next)=> {
	const { sub, user_id } = req.__JWT_PAYLOAD;
	const payload = { user_id };
	res.json({
		authToken: AuthService.createJwt(username, payload),
	});
});

module.exports = authRouter;
