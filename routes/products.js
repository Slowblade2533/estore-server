const express = require("express");
const db = require("../shared/pool");
const products = express.Router();

products.get("/", async (req, res) => {
  const mainCategoryId = req.query.maincategoryid;
  const subCategoryId = req.query.subcategoryid;
  const keyword = req.query.keyword;

  let query = "SELECT * FROM estore.products";
  let queryParams = [];

  if (mainCategoryId) {
    query =
      "SELECT estore.products.* FROM estore.products JOIN estore.categories ON products.category_id = categories.id WHERE categories.parent_category_id = $1";
    queryParams.push(mainCategoryId);

    if (keyword) {
      query += ` AND keywords LIKE '%${keyword}%'`;
    }
  } else if (subCategoryId) {
    query += " where category_id = $1";
    queryParams.push(subCategoryId);
  }

  try {
    const products = await db.any(query, queryParams);
    res.json(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

products.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const products = await db.any(
      "SELECT * FROM estore.products WHERE id = $1",
      [id]
    );
    res.json(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = products;
