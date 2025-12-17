const user = require("../models/userModel");
const Blog= require ("..models/blogModel");
const http = require("../models/httpStatus");

const slugify = require("../utils/slugify");
const seoMeta = require("../utils/seoMeta");

exports.createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(http.BAD_REQUEST).json({ message: "Title and content are required" });
    }

    if (!req.file) {
      return res.status(http.BAD_REQUEST).json({ message: "Blog image is required" });
    }

    const { metaTitle, metaDescription } = seoMeta(title, content);

    const blog = await Blog.create({
      title,
      content,
      image: req.file.path,
      slug: slugify(title),
      metaTitle,
      metaDescription,
      author: req.user.id,
    });

    res.status(http.CREATED).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });

  } catch (error) {
    res.status(http.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};


const delete_product = async (req, res) => {
  
};

const edit_product = async (req, res) => {
  
};

const show_product = async (req, res) => {
  
};
module.exports = { add_product, delete_product, edit_product, show_product };
