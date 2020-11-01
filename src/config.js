const PORT = process.env.PORT || 8000;
const NODE_ENV = process.env.NODE_ENV || production;

module.exports = {
	PORT : process.PORT,
	NODE_ENV: process.NODE_ENV,
	TEST_DB_URL: process.TEST_DB_URL,
	DB_URL: process.DB_URL
}

// TODO: remove test url export in production
