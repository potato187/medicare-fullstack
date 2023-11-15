const compression = require('compression');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const { errorHandler, notFoundHandler } = require('@/middleware');
const logActionHandler = require('./helpers/logAction.helper');
const { limitRequestHandler } = require('./helpers');

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
		allowedHeaders: ['X-Requested-With', 'Content-Type', 'Authorization', 'Refresh-Token', 'X-Client-Id'],
		credentials: true,
	}),
);

app.use('/public', express.static(path.join(__dirname, '../public')));

// config database
require('@/dbs/mongodb.init').getInstance();

app.use(logActionHandler);
// config routes
app.use('/v1/api', require('@/routes'));

app.use(limitRequestHandler);

// handling errors
app.use('*', notFoundHandler);

app.use(errorHandler);

module.exports = app;
