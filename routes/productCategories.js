const express = require("express");
const pgp = require("pg-promise")();
const productCategories = express.Router();

const cn = {
  host: "localhost",
  port: 5432,
  database: "postgres",
  user: "postgres",
  password: "1234",
};

const db = pgp(cn);

productCategories.get("/", async (req, res) => {
  try {
    const products = await db.any("SELECT * FROM estore.categories");
    res.json(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = productCategories;