const http = require("../models/httpStatus"); 

module.exports = (...allowedRoles) => {
    return (req, res, next) => {
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(http.FORBIDDEN).json({ message: "Access Denied" });
      }
      next();
    };
  };
  