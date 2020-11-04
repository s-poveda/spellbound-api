// TODO: rework into an instance of class service

const SpellsService = {
  getAllSpells(db) {
    return db('spells')
      .select()
  },
  getSpell(db, id) {
		return db('spells')
			.select()
			.where({ id })
			.first();
  },
	// TODO: serialize newSpell before passing it here
  insertSpell(db, newSpell) {
		return db('spells')
		.insert(newSpell)
		.returning('*')
		.first();
  },
  deleteSpell(db, id) {
		return db('spells')
			.delete({ id })
			.returning('*');
  },
  updateSpell(db, id, newSpellinfo) {

  }
}

module.exports = SpellsService;
