module.exports = {
	PORT : process.env.PORT,
	NODE_ENV: process.env.NODE_ENV,
	TEST_DB_URL: process.env.TEST_DB_URL,
	DATABASE_URL: process.env.DB_URL,
	SPELLBOUND_ADMIN: process.env.SPELLBOUND_ADMIN,
	SPELLBOUND_ADMIN_PWD: process.env.SPELLBOUND_ADMIN_PWD
}

// TODO: remove test url export in production
