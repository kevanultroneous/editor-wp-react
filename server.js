const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

// ======================== FOR STARTING NODE ON HTTPS ========================

// const privateKey = fs.readFileSync(
//   "/etc/letsencrypt/live/unmediabuzz.com/privkey.pem",
//   "utf8"
// );
// const certificate = fs.readFileSync(
//   "/etc/letsencrypt/live/unmediabuzz.com/cert.pem",
//   "utf8"
// );
// const ca = fs.readFileSync(
//   "/etc/letsencrypt/live/unmediabuzz.com/chain.pem",
//   "utf8"
// );

// const credentials = { key: privateKey, cert: certificate, ca: ca };

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

const server = app.listen(port, () => {
  console.log(`server running of port ${port}`);
});

// const httpsServer = https.createServer(credentials, app);
// httpsServer.listen(8000);

// catch rejection error
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION. SHUTTING DOWN");
  server.close(() => {
    process.exit(1);
  });
});
