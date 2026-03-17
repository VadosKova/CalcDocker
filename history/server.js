const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const redisClient = require("./redisClient");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

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

  await redisClient.del(`history:${req.body.userId}`);
  res.json({ message: "Saved" });
});

app.get("/history/:userId", async (req, res) => {
  const userId = req.params.userId;

  const cached = await redisClient.get(`history:${userId}`);

  if (cached) {
    console.log("From Redis");
    return res.json(JSON.parse(cached));
  }

  const data = await History
    .find({ userId: req.params.userId })
    .sort({ date: -1 });
  
  await redisClient.set(
    `history:${userId}`,
    JSON.stringify(data),
    { EX: 60 }
  );
  console.log("From MongoDB");
});

app.listen(6000, () => console.log("History service running"));