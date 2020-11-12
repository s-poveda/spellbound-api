const UsersService = {
  getSpellsByUsername(db, username, offset = 0, limit = 20) {
    return db('spells AS s')
      .select(
				's.title',
				's.description',
				's.id',
				's.date_created',
				db.raw(
					`json_strip_nulls(
						json_build_object(
							'id', u.id,
							'username', u.username
						)
					) AS "author"`
				),
			)
			.join('users AS u', 's.user_id', 'u.id')
			.where({ username })
			.limit(limit)
			.offset(offset);
  },
}

module.exports = UsersService;
