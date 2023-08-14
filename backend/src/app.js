'use strict';
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const { handlerErrors, exceptionRoute } = require('@/middleware');

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// config database
require('@/dbs').mongodInit;

// config routes
app.use('/v1/api', require('@/routes'));

app.get('/', (req, res, next) => {
	return res.status(200).json({ message: 'ok.' });
});

// handling errors
app.use('*', exceptionRoute);

app.use(handlerErrors);

module.exports = app;
