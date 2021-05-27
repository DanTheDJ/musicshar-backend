// Require rootpath package so imports can reference from folder root.
require('rootpath')();

const express = require('express');
const cookieParser = require('cookie-parser');
const  logger = require('morgan');

const cors = require('cors');

const errorHandler = require('src/_middleware/error-handler');

const { authRoutes, roomRoutes } = require('src/routes');

const { session, RedisStore, redisClient } = require('src/_core/session');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Configure session middleware
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: 'secret$%^134',
    resave: true,
    saveUninitialized: false,
    cookie: {
        secure: false, // if true only transmit cookie over https
        httpOnly: false, // if true prevent client side JS from reading the cookie 
        maxAge: 1000 * 60 * 60 * 24 // session max age in miliseconds (24hrs)
    }
}))

// allow cors requests from any origin and with credentials
app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));

// Main Routes

app.use('/auth', authRoutes);
app.use('/rooms', roomRoutes);

// global error handler
app.use(errorHandler);

module.exports = app;
