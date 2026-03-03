const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI);

const UserCalc = mongoose.model("UserCalc", {
  name: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
});

app.post("/register", async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);
  const user = new UserCalc({ name: req.body.name, email: req.body.email, password: hashed });
  await user.save();
  res.json({ message: "User created" });
});

app.post("/login", async (req, res) => {
  const user = await UserCalc.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("User not found");

  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.status(400).send("Invalid password");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});

app.listen(4000, () => console.log("Auth service running"));