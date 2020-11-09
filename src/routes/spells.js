const express = require('express');
const SpellsService = require('../services/SpellsService');
const xss = require('xss');
const SpellsRouter = express.Router();


// TODO: make this part of the service
function serializeSpell(spell) {
	return {
		user_id: spell.id,
		title: xss(spell.title),
		description: xss(spell.description),
		// damageTypes: ['array of suggested types?'],
		// IDEA: maybe use tags: [] to filter?
	}
}

SpellsRouter.route('/')
	// .all()
	.get(async (req, res, next) => {
		try {
			const data = await SpellsService.getAllSpells(req.app.get('db'));
			res.json(data);
		} catch (err) {
			console.log(err);
			next(err, req, res, next);
		}
	})
	.post((req, res, next) => {
		res.send(201, 'posted spell');
	});

SpellsRouter.route('/:spellId')
.get((req, res, next) => {
	res.send(200, 'got specific spell');
});

module.exports = SpellsRouter;
