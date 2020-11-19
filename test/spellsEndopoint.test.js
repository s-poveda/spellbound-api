const knex = require('knex');
const app = require('../src/app');
const SpellsService = require('../src/services/SpellsService');
const spellsFixture = require('./spells.fixture');
const usersFixture = require('./users.fixture');
const { API_PATH } = process.env;

describe('App', function() {
	let db = null;
	before('instanciate connection to db', () => {
		db = knex({
			client: 'pg',
			connection: process.env.TEST_DB_URL,
		});
		app.set('db', db);
	});

	before('truncate spells and users', () => {
		return db.raw(`
			TRUNCATE spells, users RESTART IDENTITY CASCADE;
			`);
	});


	after('removing test spells', () => db('spells').truncate());


	context('with spells inserted', () => {
		before('inserting test spells', async () => {
			await db('spells')
				.insert(spellsFixture.makeTestSpells());
		});

		it('GET should return every spell', async () => {
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
	});
	after('clean up', () => {
		db('spells').truncate();
		db.destroy();
	});
});
