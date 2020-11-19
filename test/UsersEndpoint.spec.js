const knex = require('knex');
const app = require('../src/app');
const UsersService = require('../src/services/UsersService');
const spellsFixture = require('./spells.fixture');
const { API_PATH } = process.env;
describe('/users endpoint', function() {
	let db = null;
	before('instanciate connection to db', () => {
		db = knex({
			client: 'pg',
			connection: process.env.TEST_DB_URL,
		});
		app.set('db', db);
	});

	after('removing test spells', () => db('spells').truncate());
	after('kill db connection', () => db.destroy());

	context('', () => {
		it('should return 200 when the user exists', async () => {
			const existingUsername = 'TheLegend27';
			const res = await supertest(app)
				.get(`${API_PATH}/users/${existingUsername}`)
				.expect(200);
			const dbSpellData = await db('spells AS s')
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
					)
				)
				.join('users AS u', 's.user_id', 'u.id')
				.where({ username: existingUsername });
			const dbUser = await db('users')
				.select('username', 'id')
				.first();
			expect(res.body).to.eql({ spells: dbSpellData, userDetails: dbUser });
		});

		it('should return 200 with non-existing user', async () => {
			const nonexistingUsername = 'thisdoesntexist';
			const res = await supertest(app)
				.get(`${API_PATH}/users/${nonexistingUsername}`)
				.expect(200);
			const dbData = await db('spells AS s')
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
					)
				)
				.join('users AS u', 's.user_id', 'u.id')
				.where({ username: nonexistingUsername });
			expect(res.body.spells).to.be.empty;
			expect(res.body.userDetails).to.be.empty;
			expect(dbData).to.be.empty;
		});
	});
});
