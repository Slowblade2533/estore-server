const express = require("express");
const db = require("../shared/pool");
const productCategories = express.Router();

productCategories.get("/", async (req, res) => {
  try {
    const products = await db.any(
      "SELECT * FROM estore.categories"
    );
    res.json(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = productCategories;