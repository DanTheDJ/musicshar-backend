// Require rootpath package so imports can reference from folder root.
require('rootpath')();

var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const errorHandler = require('src/_middleware/error-handler');

var authRoutes = require('src/routes/auth');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/auth', authRoutes);

// global error handler
app.use(errorHandler);

module.exports = app;
