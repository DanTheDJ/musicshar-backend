const Sequelize = require('sequelize');

const config = require('src/config/settings');

const sequelize = new Sequelize(config.databaseName, config.databaseUsername, config.databasePassword, {
  host: config.databaseHostname,
  dialect: config.databaseDialect,

//   pool: {
//     max: dbConfig.pool.max,
//     min: dbConfig.pool.min,
//     acquire: dbConfig.pool.acquire,
//     idle: dbConfig.pool.idle
//   }
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;