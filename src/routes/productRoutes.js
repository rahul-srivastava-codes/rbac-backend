const express = require("express");
const {
  add_product,
  delete_product,
  edit_product,
  show_product,
} = require("../controllers/productController");
const router = express.Router();

router.post("/add_product", add_product);
router.get("/mine", show_product);
router.patch("/:id", edit_product);
router.delete("/:id", delete_product);

module.export = router;
