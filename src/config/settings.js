const dotenv = require('dotenv');
dotenv.config();

module.exports = {

    // Database
    databaseUsername: process.env.DATABASE_USERNAME,
    databasePassword: process.env.DATABASE_PASSWORD,
    databaseName: process.env.DATABASE_NAME,
    databaseHostname: process.env.DATABASE_HOST,
    databaseDialect: process.env.DATABASE_DIALECT,

    // Redis
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,

    // Session
    sessionSecret: process.env.SESSION_SECRET_KEY,

    // CORS
    corsOrigin: process.env.CORS_ORIGIN

};