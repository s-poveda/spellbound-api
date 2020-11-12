const express = require('express');
const UsersService = require('../services/UsersService');

const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter.route('/:username')
	.get(async (req, res, next) => {
		const { username } = req.params;
		Promise.all([
			UsersService.getSpellsByUsername(req.app.get('db'), username),
			UsersService.getUserDetails(req.app.get('db'), username),
		])
		.then(([userSpells, userDetails]) => {
			res.json({ spells: userSpells, userDetails });
		})
		.catch(next);
	});

module.exports = usersRouter;
