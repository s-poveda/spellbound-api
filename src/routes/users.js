const express = require('express');
const UsersService = require('../services/UsersService');

const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter.route('/')
	.get( async (req, res, next) => {
		res.status(200);
	});

usersRouter.route('/:username')
	.get(async (req, res, next) => {
		const username = req.params;
		try {
			const data = await UsersService.getSpellsByUsername(
				req.app.get('db'),
				username
			);
			res.json(data);
		} catch (e) {
			next();
		}
	});

module.exports = usersRouter;
