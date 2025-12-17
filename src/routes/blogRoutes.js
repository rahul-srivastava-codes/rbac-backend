const express = require("express");
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");

const {
  create_blog,
  delete_blog,
  edit_blog,
  show_blog,
} = require("../controllers/blogController");
const router = express.Router();

router.get("/", show_blog);

router.post("/", auth , role("admin", "manager") , create_blog);

router.patch("/:id", auth, role("admin", "manager"), edit_blog);

router.delete("/:id", auth, role("admin"), delete_blog);

module.exports = router;
