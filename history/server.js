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

app.post("/save", async (req, res) => {
  const operation = new History(req.body);
  await operation.save();
  res.json({ message: "Saved" });
});

app.get("/history/:userId", async (req, res) => {
  const data = await History.find({ userId: req.params.userId });
  res.json(data);
});

app.listen(6000, () => console.log("History service running"));