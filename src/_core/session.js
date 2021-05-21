const redis = require('redis');
const session = require('express-session');
const connectRedis = require('connect-redis');

const RedisStore = connectRedis(session);

const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
});

redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
    throw err;
});
redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
});

module.exports = {
    session,
    RedisStore,
    redisClient
};