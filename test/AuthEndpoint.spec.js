const knex = require('knex');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = require('../src/app');
const UsersService = require('../src/services/UsersService');
const usersFixture = require('./users.fixture');
const spellsFixture = require('./spells.fixture');
const { API_PATH, JWT_KEY } = process.env;
describe('/auth endpoint', function() {
	let db = null;
	before('instanciate connection to db', () => {
		db = knex({
			client: 'pg',
			connection: process.env.TEST_DB_URL,
		});
		app.set('db', db);
	});

	before('truncate spells and users. Inserting test users', async () => {
		await db.raw(`TRUNCATE spells, users RESTART IDENTITY CASCADE;`);
		await db('users').insert(usersFixture.makeTestUsers());
	});
	after('kill db connection', () => db.destroy());

	context('"/login" with existing users inserted', () => {
		const userPasword = usersFixture.usersPassword;
		usersFixture.makeTestUsers().forEach(({ username, password }) => {
			it('should return 200 and JWT when the user exists', async () => {
				const res = await supertest(app)
					.post(`${API_PATH}/auth/login`)
					.send({
						username,
						password: userPasword,
					})
					.expect(200);
				expect(() => jwt.verify(res.body.authToken, JWT_KEY)).not.to.throw();
			});

			it(`returns 401 if the password is wrong`, async () => {
				await supertest(app)
					.post(`${API_PATH}/auth/login`)
					.send({
						username,
						password: 'wrong password',
					})
					.expect(401);
			});
		});

		context(`"/signup" without any users in db`, () => {
			before('truncate spells and users. Inserting test users', async () => {
				await db.raw(`TRUNCATE spells, users RESTART IDENTITY CASCADE;`);
			});
			const invalidUserObjects = [
				{
					username: '',
					password: 'ValidP4ssW0rd!', //valid? yes. Strong? No.
				},
				{
					username: 'valid username',
					password: 'lowercasebutlongenough',
				},
				{
					username: 'valid username',
					password: 'ALLUPERCASEBUT LONG',
				},
				{
					username: 'valid username',
					password: '',
				},
				{
					username: 'valid username',
					password: '!@#$r!@#$',
				},
				{
					username: 'valid username',
					password: '987651432165',
				},
			];
			invalidUserObjects.forEach(({ username, password }) => {
				it(`returns 400 if invalid data is passed`, async () => {
					await supertest(app)
						.post(`${API_PATH}/auth/signup`)
						.send({
							username,
							password,
						})
						.expect(400);
				});
			});

			it(`return 201 when a new user signs up successfully`, async () => {
				const { username, password } = usersFixture.makeNewUser();
				console.log(username, password);
				const dbBefore = await db('users')
					.select()
					.where({ username });
				await supertest(app)
					.post(`${API_PATH}/auth/signup`)
					.send({
						username,
						password,
					})
					.expect(204);
				const dbData = await db('users')
					.select()
					.where({ username })
					.first();
				expect(dbBefore).to.be.empty;
				expect(dbData).to.have.all.keys(['id', 'username', 'password']);
			});
		});
	});
});
