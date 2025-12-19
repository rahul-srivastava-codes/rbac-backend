const express = require("express");
const app = express();
const connectionDB = require("./src/config/dbConnect");
const authRoutes = require("./src/routes/authRoutes");
const blogRoutes = require("./src/routes/blogRoutes");
const cors = require("cors");

require("dotenv").config();
app.use(express.json());
app.use(cors());

const port = Number(process.env.PORT) || 3000;
connectionDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/auth", authRoutes);
app.use("/api/blog", blogRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

