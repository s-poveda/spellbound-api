const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const knex = require('knex');
const SpellsRouter = require('./routes/spells.js');
const {
	NODE_ENV,
	DATABASE_URL,
	SPELLBOUND_ADMIN,
	SPELLBOUND_ADMIN_PWD,
	API_PATH
} = require('./config');

const app = express();
const morganOptn = (NODE_ENV === 'production') ? 'tiny' : 'common';

app.use(morgan(morganOptn));
app.use(helmet());
app.use(cors(/* env var white*/));

console.log(`${API_PATH}/spells`);
// routes ::::::::::::::::
app.use(`${API_PATH}/spells`, SpellsRouter);

// app.use(`/${API_PATH}/users`, UsersRouter);

app.get('/', (req, res)=>{
	res.status(200).end();
});


//generic error handler
app.use( (error, req, res, next) =>{
	let response = null;
 	if ( NODE_ENV === 'production' ) {
		response = { message : 'server error' };
	} else {
		console.log(error);
		response = { error, message : error.message };
	}
	res.json(response);
});

// TODO: implement winston logging

module.exports = app;
