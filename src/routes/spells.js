const express = require('express');
const SpellsService = require('../services/SpellsService');
const xss = require('xss');
const SpellsRouter = express.Router();

const jsonBodyParser = express.json();
// TODO: make this part of the service
function serializeSpell(spell, user_id) {
	return {
		user_id,
		title: xss(spell.title),
		description: xss(spell.description),
		// damageTypes: ['array of suggested types?'],
		// IDEA: maybe use tags: [] to filter?
	};
}

SpellsRouter.route('/')
	// .all()
	.get(async (req, res, next) => {
		try {
			const data = await SpellsService.getAllSpells(req.app.get('db'));
			res.json(data);
		} catch (err) {
			next(err, req, res, next);
		}
	})
	.post(jsonBodyParser, (req, res, next) => {
		res.send(201, 'posted spell');
	});

SpellsRouter.route('/:spellId')
	.get((req, res, next) => {
		res.send(200, 'got specific spell');
	})
	.patch(jsonBodyParser, async (req, res, next)=>{

	});

module.exports = SpellsRouter;
