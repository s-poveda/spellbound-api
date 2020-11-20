const express = require('express');
const xss = require('xss');
const SpellsService = require('../services/SpellsService');
const requireAuth = require('../middleware/requireAuth');
const SpellsRouter = express.Router();

const jsonBodyParser = express.json();
// TODO: make this part of the service
function serializeSpell(spell, user_id) {
	user_id = Number(user_id);
	if (!user_id || typeof user_id !== 'number') throw new Error('Invalid data received.');
	if (spell.title.length === 0 || spell.description.length === 0) throw new Error('A title and description must be provided.');
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
		 let newSpell = null;
		 try {
			 newSpell = serializeSpell( req.body, user_id);
		 } catch (e) {
			 return res.status(400).json({ message: e.message })
		 }
		 await SpellsService.insertSpell(
			 req.app.get('db'),
			 newSpell
		 );
		 res.status(201).json({});
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
	});

module.exports = SpellsRouter;
