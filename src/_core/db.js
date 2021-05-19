const Sequelize = require('sequelize');

const config = require('src/config/db.config');

const sequelize = new Sequelize(config.Database, config.Username, config.Password, {
  host: config.Hostname,
  dialect: config.Dialect,

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