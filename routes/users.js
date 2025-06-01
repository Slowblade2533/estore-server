const express = require("express");
const db = require("../shared/pool");
const bcrypt = require("bcryptjs");

const user = express.Router();

user.post("/signup", async (req, res) => {

  const { email, firstName, lastName, address, city, state, pin, password } =
    req.body;

  try {
    const existingUser = await db.any(
      "SELECT count(*) AS count FROM estore.users WHERE email = $1",
      [email]
    );
    if (existingUser[0].count > 0) {
      return res.status(200).send("Email already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.any(
      "INSERT INTO estore.users (email, firstName, lastName, address, city, state, pin, password) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
      [email, firstName, lastName, address, city, state, pin, hashedPassword]
    );
    res.status(201).send("Success");
  } catch (e) {
    res.status(500).send(e.message) || "Something Went Wrong";
  }
});

user.get("/signup", async (req, res) => {
  try {
    const users = await db.any(
      "SELECT * FROM estore.users"
    );
    res.json(users);
  } catch (error) {
    res.status(500).send(error)
  }

});

module.exports = user;
