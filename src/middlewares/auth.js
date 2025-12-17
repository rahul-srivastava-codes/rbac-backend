const jwt = require("jsonwebtoken");
const http = require("../models/httpStatus"); 

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
    .status(http.UNAUTHORIZED)
    .json({ message: "Unauthorised Access" });
  }
   
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
};
