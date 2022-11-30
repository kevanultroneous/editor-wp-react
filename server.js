const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

// ======================== EVERYTHING RELATED TO SERVER WILL BE HERE ========================

// catch exception error
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION. SHUTTING DOWN");
  process.exit(1);
});

dotenv.config({ path: "./.env" });

// database connection
mongoose
  .connect(process.env.DB_URL.replace("<password>", process.env.DB_PASS))
  .then((r) => console.log("database connect"))
  .catch((e) => console.log("error" + e));

const port = process.env.PORT || 8000;

const server = app.listen(port, e => {
  if(!e) console.log(`server running of port ${port}`);
});

// catch rejection error
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION. SHUTTING DOWN");
  server.close(() => {
    process.exit(1);
  });
});
