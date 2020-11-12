const knex = require('knex');
const app = require('../src/app');
const UsersService = require('../src/services/UsersService');
const { API_PATH } = process.env;
describe('/users endpoint', function () {
	let db = null;
	before('instanciate connection to db', ()=> {
		db = knex({
			client: 'pg',
			connection: process.env.TEST_DB_URL
		});
		app.set('db', db);
	});

	after('kill db connection', ()=> db.destroy());

	context('', () => {
		it('should return 200', async () => {
			const existingUsername = 'TheLegend27';
			const res = await supertest(app)
				.get(`${API_PATH}/users/${existingUsername}`)
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
					),
				)
				.join('users AS u', 's.user_id', 'u.id')
				.where({ username: existingUsername });
			expect(res.body).to.eql(dbData);
		});

		it('should return 200 with non-standard chars', async () => {
			const nonexistingUsername = 'TheLegend27';
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
					),
				)
				.join('users AS u', 's.user_id', 'u.id')
				.where({ username: nonexistingUsername });
			expect(res.body).to.eql(dbData);
		});
	});

});
