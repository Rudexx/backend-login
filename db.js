const pgp = require('pg-promise')();
const db = pgp({
  host: 'taller-afin.cwfgmw8sg4q7.us-east-1.rds.amazonaws.com',
  port: 5432, // Default PostgreSQL port
  database: 'taller_afin',
  user: 'postgres',
  password: 'Gugusano147*',
  ssl: { rejectUnauthorized: false }
});

module.exports = db;
