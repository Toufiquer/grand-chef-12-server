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

// Add MongoDB connection
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.mxvrtkz.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

client.connect();
async function run() {
  // create a database
  const usersCollection = client.db("usersCollection").collection("users");
  console.log("Node is running", " => Line No: 29");

  const findUserByEmail = async (email) => {
    const query = { email };
    const options = {};
    const result = await usersCollection.findOne(query, options);
    return result;
  };

  app.get("/", (req, res) => {
    res.send({ message: "Server is running" });
  });
  app.get("/data", (req, res) => {
    res.send({ data, review });
  });

  // Create an access token
  app.post("/jwt", async (req, res) => {
    const email = req.body.email;
    const data = { email };
    const token = jwt.sign(data, process.env.TOKEN_SECRET, {
      expiresIn: "1h",
    });

    // save to database email and role if not Exist
    const user = {
      email,
      role: "student",
    };
    let result = {};
    const isExist = await findUserByEmail(email);
    if (!isExist?.role) {
      result = await usersCollection.insertOne(user);
    }
    result.token = token;
    res.send({ result });
  });

  // get all user
  app.get("/users", async (req, res) => {
    const query = {};
    const options = {};
    const cursor = usersCollection.find(query, options);
    const result = await cursor.toArray();
    res.send(result);
  });

  // delete a user
  app.delete("/users/:id", async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const filter = { _id: new ObjectId(id) };
    const result = await usersCollection.deleteOne(filter);
    res.send(result);
  });

  // get a user role by email
  app.get("/users/:email", async (req, res) => {
    const { email } = req.params;
    // Query for a movie that has the title 'The Room'
    const query = { email };
    const options = {};
    const result = await usersCollection.findOne(query, options);
    res.send({ result });
  });
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("Server is running on port ", port);
});
