const user = require("../models/userModel");
const Blog= require ("../models/blogModel");
const http = require("../models/httpStatus");

const slugify = require("../utils/slugify");
const seoMeta = require("../utils/seoMeta");

const create_blog = async (req, res) => {
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

    res.status(http.CREATED).json({success: true,message: "Blog created successfully",data: blog});

  } catch (error) {
    res.status(http.INTERNAL_SERVER_ERROR).json({success: false,message: error.message});
  }
};


const delete_blog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(http.NOT_FOUND).json({success: false,message: "Blog not found",});
    }
    await blog.deleteOne();
    res.status(http.OK).json({success: true,message: "Blog deleted successfully",});

  } catch (error) {
    res.status(http.INTERNAL_SERVER_ERROR).json({success: false,message: error.message,});
  }
};


const edit_blog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(http.NOT_FOUND).json({success: false,message: "Blog not found"});
    }
    if (title || content) {
      const seoData = seoMeta(title || blog.title,content || blog.content);
      blog.metaTitle = seoData.metaTitle;
      blog.metaDescription = seoData.metaDescription;
    }
    if (title) {
      blog.title = title;
      blog.slug = slugify(title);
    }
    if (content) {
      blog.content = content;
    }
    if (req.file) {
      blog.image = req.file.path;
    }

    await blog.save();

    res.status(http.OK).json({success: true,message: "Blog updated successfully", data: blog,});

  } catch (error) {
    res.status(http.INTERNAL_SERVER_ERROR).json({success: false,message: error.message,});
  }
};


const show_blog = async (req, res) => {
  try {
    const { slug } = req.params;
    let result;

    if (slug) {
      result = await Blog.findOne({ slug }).populate("author", "name email");

      if (!result) {
        return res.status(http.NOT_FOUND).json({
          success: false,
          message: "Blog not found",
        });
      }
    } else {
      result = await Blog.find().sort({ createdAt: -1 }).populate("author", "name email");
    }

    res.status(http.OK).json({success: true, data: result});

  } catch (error) {
    res.status(http.INTERNAL_SERVER_ERROR).json({success: false,message: error.message});
  }
};

 module.exports={create_blog,delete_blog,show_blog,edit_blog};