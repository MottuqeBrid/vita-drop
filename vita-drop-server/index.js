const express = require("express");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

const port = process.env.PORT || 4000;

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the VitaDrop API" });
});

app.use("/api/users", require("./router/user.router"));
app.use("/api/donors", require("./router/donor.router"));
app.use("/api", require("./router/upload"));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
