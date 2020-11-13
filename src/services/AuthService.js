const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_KEY } = require('../config');
const AuthService = {
	getUserByUsername(db, username) {
		return db('users')
			.select('username', 'id', 'password')
			.where({ username })
			.first();
	},
	async insertNewUser(db, username, password) {
		const passwordHash = await this.hashPassword(password);
		return db('users').insert([{ username, password: passwordHash }]);
	},
	createJwt(subject, payload) {
		return jwt.sign(payload, JWT_KEY, {
			subject,
			expiresIn: '1h',
			algorithm: 'HS256',
		});
	},
	verifyJwt(token) {
		return jwt.verify(token, JWT_KEY, { algorithms: ['HS256'] });
	},
	getPayload(token) {
		return JSON.parse(Buffer.from(token.split('.')[1], 'base64'));
	},
	comparePwdToHash(password, hash) {
		return bcrypt.compare(password, hash);
	},
	hashPassword(password) {
		return bcrypt.hash(password, 12);
	},
};

module.exports = AuthService;
