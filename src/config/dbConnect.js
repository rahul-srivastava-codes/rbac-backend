const mongoose = require("mongoose");

async function connectDB() {
  try {
    const connect = await mongoose.connect(process.env.DB_url);
    // console.log(connect);
    console.log("Database connected successfully: " + connect.connection.host);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
module.exports = connectDB;
