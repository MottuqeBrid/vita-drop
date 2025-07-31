const express = require("express");
require("dotenv").config();
const cosrs = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the VitaDrop API" });
});

app.use("/api/users", require("./router/user.router"));
app.use("/api/donors", require("./router/donor.router"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
