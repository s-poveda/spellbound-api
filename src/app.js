const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const knex = require('knex');
const UsersRouter = require('./routes/users')
const {
	NODE_ENV,
	DATABASE_URL,
	SPELLBOUND_ADMIN,
	SPELLBOUND_ADMIN_PWD,
	API_PATH,
	CLIENT_ORIGIN
} = require('./config');

const app = express();
const morganOptn = (NODE_ENV === 'production') ? 'tiny' : 'common';

app.use(morgan(morganOptn));
app.use(helmet());
app.use(cors({
	origin: CLIENT_ORIGIN
}));
// routes ::::::::::::::::

app.use(`${API_PATH}/users`, UsersRouter);
app.use(`${API_PATH}/auth`, require('./routes/auth'));
app.use(`${API_PATH}/spells`, require('./routes/spells'));

//generic error handler
app.use( (error, req, res, next) =>{
	let response = null;
 	if ( NODE_ENV === 'production' ) {
		response = { message : 'server error' };
	} else {
		console.log(error);
		response = { error, message : error.message };
	}
	res.status(500).json(response);
});

// TODO: implement winston logging

module.exports = app;
