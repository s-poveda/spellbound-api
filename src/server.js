require('dotenv').config();
const app = require('./app.js');
const { PORT } = require('./config');

app.set('db', knex({
	client: 'pg',
	connection: {
		host: 'localhost',
		user: SPELLBOUND_ADMIN,
		password: SPELLBOUND_ADMIN_PWD
	}
}));

app.listen(PORT, ()=> console.log(`Listening on port ${PORT}`));
