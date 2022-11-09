const mongoose = require('mongoose');
const dotenv = require('dotenv')
const app = require('./app')

dotenv.config()
// database connection
mongoose.connect(process.env.DB_URL.replace('<password>', process.env.DB_PASS))
    .then((r) => console.log("database connect"))
    .catch((e) => console.log("error" + e))

// listining
