const pgp = require("pg-promise")();

const cn = {
  host: "localhost",
  port: 5432,
  database: "postgres",
  user: "postgres",
  password: "1234",
};

const pool = pgp(cn);

module.exports = pool;