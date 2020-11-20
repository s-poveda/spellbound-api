const knex = require('knex');
const app = require('../src/app');
const UsersService = require('../src/services/UsersService');
const usersFixture = require('./users.fixture');
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

	before(
		'truncate spells and users. Inserting test users and spells',
		async () => {
			await db.raw(`
			TRUNCATE spells, users RESTART IDENTITY CASCADE;
			`);
			await db('users').insert(usersFixture.makeTestUsers());
			await db('spells').insert(spellsFixture.makeTestSpells());
		}
	);
	after('kill db connection', () => db.destroy());

	context('returns all spells that the user has created', () => {
		usersFixture.makeTestUsers().forEach(({ username }) => {
			it('should return 200 when the user exists', async () => {
				const res = await supertest(app)
					.get(`${API_PATH}/users/${username}`)
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
					.where({ 'u.username': username });
				const dbUser = await db('users')
					.select('username', 'id')
					.where({ username })
					.first();
				expect({
					...res.body,
					spells: res.body.spells.map(s => {
						return { ...s, date_created: new Date(s.date_created) };
					}),
				}).to.eql({ spells: dbSpellData, userDetails: dbUser });
			});
		});

		it('should return 200 and empty data with non-existing user', async () => {
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
			const dbUser = await db('users')
				.select('username', 'id')
				.where({ username: nonexistingUsername });
			expect(res.body.spells).to.be.empty;
			expect(res.body.userDetails).to.be.empty;
			expect(dbData).to.be.empty;
			expect(res.body).to.eql({ spells: dbData, userDetails: dbUser });
		});
	});
});
