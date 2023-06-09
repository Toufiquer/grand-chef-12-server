const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const jwt = require("jsonwebtoken");
const data = require("./data.json");
const review = require("./review.json");
// json web token

app.use(express.json());
app.use(cors());

async function run() {
  console.log("Node is running", " => Line No: 29");

  app.get("/", (req, res) => {
    res.send({ message: "Server is running" });
  });
  app.get("/data", (req, res) => {
    res.send({ data });
  });
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("Server is running on port ", port);
});
