module.exports = {
	PORT : process.env.PORT || 8080,
	NODE_ENV: process.env.NODE_ENV || 'production',
	TEST_DB_URL: process.env.TEST_DB_URL,
	DATABASE_URL: process.env.DB_URL,
	SPELLBOUND_ADMIN: process.env.SPELLBOUND_ADMIN,
	SPELLBOUND_ADMIN_PWD: process.env.SPELLBOUND_ADMIN_PWD || '',
	API_PATH: process.env.API_PATH,
}

// TODO: remove test url export in production
