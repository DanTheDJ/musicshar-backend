// Require rootpath package so imports can reference from folder root.
require('rootpath')();

const express = require('express');
const cookieParser = require('cookie-parser');
const  logger = require('morgan');

const cors = require('cors');

const errorHandler = require('src/_middleware/error-handler');

const authRoutes = require('src/routes/auth');

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
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // if true only transmit cookie over https
        httpOnly: false, // if true prevent client side JS from reading the cookie 
        maxAge: 1000 * 60 * 10 // session max age in miliseconds
    }
}))

// allow cors requests from any origin and with credentials
app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));

// Main Routes

app.use('/auth', authRoutes);

// global error handler
app.use(errorHandler);

module.exports = app;
