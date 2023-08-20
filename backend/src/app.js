'use strict';
const { handlerErrors, handlerRouteException } = require('@/middleware');
const compression = require('compression');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

require('dotenv').config();
const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
		allowedHeaders: ['X-Requested-With', 'Content-Type', 'Authorization', 'X-Client-Id'],
		credentials: true,
	}),
);

app.use('/public', express.static(path.join(__dirname, '../public')));

// config database
require('@/dbs').mongodInit;

// config routes
app.use('/v1/api', require('@/routes'));

// handling errors
app.use('*', handlerRouteException);

app.use(handlerErrors);

module.exports = app;
