module.exports = {
	PORT : process.env.PORT || 8080,
	NODE_ENV: process.env.NODE_ENV || 'production',
	TEST_DB_URL: process.env.TEST_DB_URL,
	DATABASE_URL: process.env.DATABASE_URL,
	SPELLBOUND_ADMIN: process.env.SPELLBOUND_ADMIN,
	SPELLBOUND_ADMIN_PWD: process.env.SPELLBOUND_ADMIN_PWD || '',
	API_PATH: process.env.API_PATH,
	JWT_KEY: process.env.JWT_KEY,
	JWT_TIMEOUT: process.env.JWT_TIMEOUT || '20s',
	CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'localhost:3000'
}
