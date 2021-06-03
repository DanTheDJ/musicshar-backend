const redis = require('redis');
const env = process.env.NODE_ENV || 'development';
const config = require('src/config/settings');

const expressSession = require('express-session');

const connectRedis = require('connect-redis');
const sharedsession = require("express-socket.io-session");

const RedisStore = connectRedis(expressSession);

const redisClient = redis.createClient({
    host: config.redisHost,
    port: config.redisPort
});

redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
    throw err;
});
redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
});

const session = expressSession({
    secret: config.sessionSecret,
    name: 'MusicSharSession',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    store: new RedisStore({ host: config.redisHost, port: config.redisPort, client: redisClient, ttl: 86400 }),
});

const sharedSession = sharedsession(session);

module.exports = {
    session,
    sharedSession,
    RedisStore,
    redisClient
};