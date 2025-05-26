const express = require("express");
const db = require("../shared/pool");
const products = express.Router();

products.get("/", async (req, res) => {
  try {
    const products = await db.any(
        "SELECT * FROM estore.products"
    );
    res.json(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

products.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const products = await db.any(
      `SELECT * FROM estore.products WHERE id = $1`, [id]
    );
    res.json(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = products;
