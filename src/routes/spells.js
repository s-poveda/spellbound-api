const express = require('express');
const xss = require('xss');
const SpellsService = require('../services/SpellsService');
const requireAuth = require('../middleware/requireAuth');
const SpellsRouter = express.Router();

const jsonBodyParser = express.json();
// TODO: make this part of the service
function serializeSpell(spell, user_id) {
	user_id = Number(user_id);
	if (!user_id || typeof user_id !== 'number') throw new Error('Invalid data. Cannot serialize');
	return {
		user_id,
		title: xss(spell.title),
		description: xss(spell.description),
		// damageTypes: ['array of suggested types?'],
		// IDEA: maybe use tags: [] to filter?
	};
}

SpellsRouter.route('/')
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
	.get(async (req, res, next) => {
		try {
			const { spellId } = req.params;
			const spell = await SpellsService.getSpellById(
				req.app.get('db'),
				spellId
			);
			if (!spell) return res.sendStatus(404);
			res.json(spell);
		} catch (e) {
			next(e);
		}
	})
	.patch(jsonBodyParser, async (req, res, next)=>{

	})
	.delete(requireAuth, jsonBodyParser, async (req, res, next) => {
		// FIXME: there should a better way of checking if the spell belongs to a users
		//				without making two separate requests to db.
		//				one trx maybe?
		try {
			const spellId = Number(req.params.spellId);
		if (!spellId) return res.sendStatus(403);

		const { author } = await SpellsService.getSpellById(
			req.app.get('db'),
			spellId
		);
		//if id of author of spell ===  id in the jwt
		if (author.id === req.__JWT_PAYLOAD.user_id) {
			await SpellsService.deleteSpell(
				req.app.get('db'),
				spellId
			);
			res.sendStatus(204);
		} else {
			res.sendStatus(403);
		}

		} catch (e) {
			next(e);
		}
	});

module.exports = SpellsRouter;
