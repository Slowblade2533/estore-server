const express = require("express");
const db = require("../shared/pool");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const user = express.Router();

user.post("/signup", async (req, res) => {
  const { email, firstName, lastName, address, city, state, pin, password } =
    req.body;

  try {
    const existingUser = await db.oneOrNone(
      "SELECT * FROM estore.users WHERE email = $1",
      [email]
    );
    if (existingUser) {
      return res.status(200).send({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.any(
      "INSERT INTO estore.users (email, firstName, lastName, address, city, state, pin, password) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
      [email, firstName, lastName, address, city, state, pin, hashedPassword]
    );
    res.status(201).send({ message: "Success" });
  } catch (error) {
    console.log("Signup Error: ", error);
    res.status(500).send({
      error: error.code || "INTERNAL_ERROR",
      message: error.message || "Something went wrong",
    });
  }
});

user.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const users = await db.any(
      "SELECT * FROM estore.users WHERE email = $1",
      [email]
    );
    if (users.length === 0) {
      return res.status(401).send({ message: "User does not exist" });
    }
    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if(!passwordMatch) {
      return res.status(401).send({ message: "Invalid password." });
    }

    const token = jwt.sign(
      {
        id: user.id, 
        email: user.email
      },
      "estore-secret-key",
      { expiresIn: "1h" }
    );
    res.status(200).send({ token, message: "Login successful" });
  } catch (error) {
    console.log("Login Error: ", error);
    res.status(500).send({
      error: error.code || "INTERNAL_ERROR",
      message: error.message || "Something went wrong"
    });
  }
});

user.get("/signup", async (req, res) => {
  try {
    const users = await db.any("SELECT * FROM estore.users");
    res.json(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = user;
