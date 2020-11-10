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
	comparePwdToHash(password, hash) {
		return bcrypt.compare(password, hash);
	},
	createJwt(subject, payload) {
		return jwt.sign(payload, JWT_KEY, {
			subject,
			expiresIn: '1h',
			algorithm: 'HS256',
		});
	},
	verifyJwt(token) {
		return jwt.verify(tokeN, JWT_KEY, { algorithms: ['HS256'] });
	},
};

module.exports = AuthService;
