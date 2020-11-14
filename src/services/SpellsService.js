// TODO: rework into an instance of class service

const SpellsService = {
  getAllSpells(db, offset = 0, limit = 20) {
    return db('spells AS s')
      .select(
				's.id',
				's.title',
				's.description',
				's.date_created',
				db.raw(
					`json_strip_nulls(
						json_build_object(
							'id', u.id,
							'username', u.username
						)
					) AS "author"`
				)
			)
			.join('users AS u', 's.user_id', 'u.id')
			.limit(limit)
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
