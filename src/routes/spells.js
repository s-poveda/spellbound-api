const express = require('express');
const xss = require('xss');
const SpellsService = require('../services/SpellsService');
const requireAuth = require('../middleware/requireAuth');

const SpellsRouter = express.Router();

const jsonBodyParser = express.json();
// TODO: make this part of the service
function serializeSpell(spell, user_id) {
	user_id = Number(user_id);
	if (!user_id || typeof user_id === 'number') throw new Error('Invalid data. Cannot serialize');
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
	.post(requireAuth, jsonBodyParser, async (req, res, next) => {
	 try {
		 const { user_id } = req.__JWT_PAYLOAD;
		 const newSpell = serializeSpell( req.body, user_id);

		 await SpellsService.insertSpell(
			 req.app.get('db'),
			 newSpell
		 );
		 res.sendStatus(201);
	 } catch (e) {
		 next(e);
	 }
	});

SpellsRouter.route('/:spellId')
	.get((req, res, next) => {
		res.send(200, 'got specific spell');
	})
	.patch(jsonBodyParser, async (req, res, next)=>{

	});

module.exports = SpellsRouter;
