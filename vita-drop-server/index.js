const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const app = express();

const port = process.env.PORT || 4000;

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://vita-drop.vercel.app",
      "http://localhost:4000",
      "https://vita-drop-server.vercel.app",
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the VitaDrop API" });
});

app.use("/api/users", require("./router/user.router"));
app.use("/api/donors", require("./router/donor.router"));
app.use("/api", require("./router/upload"));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
