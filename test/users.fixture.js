const bcrypt = require('bcrypt');

const usersFixture = {
	makeTestUsers() {
		return [
			{
				username: 'TheLegend27',
				id: 1,
				password: bcrypt.hashSync(usersFixture.usersPassword, 12),
			},
			{
				username: 'g3tsh3r3k3d',
				id: 2,
				password: bcrypt.hashSync(usersFixture.usersPassword, 12),
			},
			{
				username: 'testUsers',
				id: 3,
				password: bcrypt.hashSync(usersFixture.usersPassword, 12),
			},
		];
	},
	makeNewUser() {
		return {
			username: 'new test user',
			password: '!s#CDupjkjz*.h12'
		}
	},
	usersPassword: '1234567890'
};

module.exports = usersFixture;
