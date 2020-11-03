const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const knex = require('knex');
const { NODE_ENV, DB_URL } = require('./config');

const app = express();

const morganOptn = (NODE_ENV === 'production') ? 'tiny' : 'common';

app.use(morgan(morganOptn));
app.use(helmet());
app.use(cors());

app.set('db', knex({
	connectionString: DB_URL,
	client: 'pg',
}));

// routes ::::::::
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
