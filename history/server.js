const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI);

const History = mongoose.model("History", {
  userId: String,
  a: Number,
  b: Number,
  operator: String,
  result: Number,
  date: { type: Date, default: Date.now }
});