const app = require('../src/app');
const knex = require('knex');
const basePath = '/api';

describe('App', function(){
	it('GET responds 200 at "/"', ()=>{
		return supertest(app)
			.get('/')
			.expect(200);
	});

	describe('"/spells" endpoint', ()=> {
		it("GET '/spells' should return 200", () => {
			return supertest(app)
				.get(`${basePath}/spells`)
				.expect(200);
			});
	});
});
