const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const user = require("../models/");
const http = require("../models/httpStatus");

const add_product = async (req, res) => {
  try {
    const { name, role, email, password } = req.body;

    if (!name || !email || !password || !role) {
      return res
        .status(http.BAD_REQUEST)
        .json({ message: "All fields are required", success: false });
    }
    const existingUser = await user.findOne({ email });
    if (existingUser)
      return res
        .status(http.BAD_REQUEST)
        .json({ message: "Email already exists", success: false });

    const hashedpassword = await bcrypt.hash(
      String(password),
      Number(process.env.salt)
    );

    await user.create({
      name,
      role,
      email,
      password: hashedpassword,
    });

    return res.status(http.OK).json({
      success: true,
      message: "Account created successfully: " + name,
    });
  } catch (error) {
    return res.status(http.BAD_REQUEST).json({
      success: false,
      message: "Something is wrong",
    });
  }
};

const delete_product = async (req, res) => {
  try {
    const { email, password } = req.body;

    const User = await user.findOne({ email });
    if (!User) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, User.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const token = jwt.sign(
      { id: User._id, role: User.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: User._id,
        name: User.name,
        email: User.email,
        role: User.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

const edit_product = async (req, res) => {
  res
    .cookie("token", "", { maxAge: 0 })
    .json({ message: "Logout successful", success: true });
};
const show_product = async (req, res) => {
  res
    .cookie("token", "", { maxAge: 0 })
    .json({ message: "Logout successful", success: true });
};
module.exports = { add_product, delete_product, edit_product, show_product };
