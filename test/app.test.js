const app = require('../src/app');
const knex = require('knex');
const SpellsService = require('../src/services/SpellsService');
const { makeTestSpells } = require('./spells.fixture.js');
const basePath = '/api';

describe('App', function(){
	let db = null;
	before('instanciate connection to db', ()=> {
		db = knex({
			client: 'pg',
			connection: process.env.TEST_DB_URL
		});
		app.set('db', db);
	});

	it('GET responds 200 at "/"', ()=>{
		return supertest(app)
			.get('/')
			.expect(200)
			});

			describe('"/spells" endpoint', ()=> {
				context('with spells inserted', ()=>{

					before('inserting test spells',()=> db('spells').insert(makeTestSpells()));
					after('removing test spells', ()=> db('spells').truncate());

					it("GET should return every spell", () => {
						return supertest(app)
							.get(`${basePath}/spells`)
							.expect(200)
							.then((res) => {
								return db('spells')
									.select()
									.then( actualData => {
										expect(res.body.length).to.eql(actualData.length);
										expect(res.body[0]).to.be.an('object');
										expect(res.body[0]).to.have.all.keys(['title', 'id', 'description', 'date_created', 'user_id']);
										expect(res.body[0].title).to.eql(actualData[0].title);
										expect(res.body[0].description).to.eql(actualData[0].description);
									});
					});
				});
			});
		});
		after('clean up', ()=> {
			db('spells').truncate();
			db.destroy();
		});
});
