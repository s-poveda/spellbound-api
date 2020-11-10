// TODO: rework into an instance of class service

const SpellsService = {
  getAllSpells(db, offset = 0) {
    return db('spells')
      .select()
			.limit(20)
			.offset(offset);
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
