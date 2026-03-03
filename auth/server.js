const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://admin:admin@db.bdboune.mongodb.net/?appName=DB");

const UserCalc = mongoose.model("UserCalc", {
  name: String,
  email: String,
  password: String,
});