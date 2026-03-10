const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

require("dotenv").config();
const SECRET = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  });
}

app.post("/calculate", authenticateToken, async (req, res) => {
  const { a, b, operator } = req.body;

  let result;

  switch (operator) {
    case "+": result = a + b; break;
    case "-": result = a - b; break;
    case "*": result = a * b; break;
    case "/": result = a / b; break;
    case "%": result = a % b; break;
    default:
      return res.status(400).json({ message: "Invalid operator" });
  }

  res.json({ result });

  await axios.post("http://history:6000/save", {
    userId: req.user.id,
    a,
    b,
    operator,
    result
  });
});

app.get("/history/:userId", async (req, res) => {
  try {
    const response = await axios.get(
      `http://history:6000/history/${req.params.userId}`
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: "History service error" });
  }
});

app.listen(5000, () => console.log("Calc service running"));