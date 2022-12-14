const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const dotenv = require("dotenv");

const postRouter = require("./src/router/postRouter");
const categoryRouter = require("./src/router/categoryRouter");
const planRouter = require("./src/router/planRouter");
const contactRouter = require("./src/router/contactUsRouter");
const userRouter = require("./src/router/userRouter");

const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(express.static("uploads"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// content image upload
app.get("/test", async (req, res) => {
  const { a, b } = req.body;

  console.log(a, b);
  res.send("working");
});

app.use("/api/post/", postRouter);
app.use("/api/category/", categoryRouter);
app.use("/api/plan", planRouter);
app.use("/api/contact", contactRouter);
app.use("/api/user", userRouter);

module.exports = app;
