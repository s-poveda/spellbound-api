const knex = require('knex');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const SpellsService = require('../src/services/SpellsService');
const spellsFixture = require('./spells.fixture');
const usersFixture = require('./users.fixture');
const { API_PATH, JWT_KEY } = process.env;

describe('App', function() {
	let db = null;
	before('instanciate connection to db', () => {
		db = knex({
			client: 'pg',
			connection: process.env.TEST_DB_URL,
		});
		app.set('db', db);
	});

	before('truncate spells and users. Inserting test users', async () => {
		await db.raw(`
			TRUNCATE spells, users RESTART IDENTITY CASCADE;
			`);
		await db('users').insert(usersFixture.makeTestUsers());
	});

	after('removing test spells', () => db('spells').truncate());

	context('GET "/spells" with spells inserted', () => {
		before('inserting test spells', async () => {
			await db('spells').insert(spellsFixture.makeTestSpells());
		});

		after(`removing test spells`, async () => {
			await db.raw(`
				TRUNCATE spells RESTART IDENTITY CASCADE;
			`);
		});

		it('should return every spell', async () => {
			const res = await supertest(app)
				.get(`${API_PATH}/spells`)
				.expect(200);
			const actualData = await db('spells').select();
			expect(res.body.length).to.eql(actualData.length);
			expect(res.body[0]).to.be.an('object');
			expect(res.body[0]).to.have.all.keys([
				'title',
				'id',
				'description',
				'date_created',
				'author',
			]);
			expect(res.body[0].title).to.eql(actualData[0].title);
			expect(res.body[0].description).to.eql(actualData[0].description);
		});

		it(`"/spells/:spellId" returns the spell object`, async () => {
			const spellId = 2;
			const res = await supertest(app)
				.get(`${API_PATH}/spells/${spellId}`)
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
				.where({ 's.id': spellId })
				.first();
			expect(res.body).to.be.an('object');
			expect(res.body).to.have.all.keys([
				'title',
				'id',
				'description',
				'date_created',
				'author',
			]);
			expect({
				...res.body,
				date_created: new Date(res.body.date_created),
			}).to.eql(dbData);
		});
	});

	context(`POST "/spells" endpoint`, () => {
		before('remove spells', async() => {
				await db('spells').truncate();
		});

		it(`POST "/spells" returns 401 with no auth`, async () => {
			await supertest(app)
				.post(`${API_PATH}/spells`)
				.expect(401);
		});

		it(`returns 201 when when a new is added successfully`, async () => {
			const authToken = await jwt.sign({user_id: 1}, JWT_KEY, {
				algorithm: 'HS256',
			});
			const testSpell = spellsFixture.makeNewSpell();
			await supertest(app)
				.post(`${API_PATH}/spells`)
				.set('Authorization', `Bearer ${authToken}`)
				.send(testSpell)
				.expect(201);

				const dbData = await db('spells')
					.select()
					.where({ title: testSpell.title, description: testSpell.description })
					.first();

				expect(dbData).to.have.keys([...Object.keys(testSpell), 'id', 'date_created', 'user_id']);
				expect(dbData.title).to.eql(testSpell.title);
				expect(dbData.description).to.eql(testSpell.description);
		});
	});

	after('clean up', () => {
		db('spells').truncate();
		db.destroy();
	});
});
