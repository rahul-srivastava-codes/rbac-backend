const express = require("express");
const app = express();
const connectionDB = require("./config/dbConnect");
const authrouter = require("./routes/authRoutes");
const cors = require("cors");

require("dotenv").config();
app.use(express.json());
app.use(cors());

const port = Number(process.env.PORT) || 3000;
connectionDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/auth", authrouter);

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`);
});
