const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const user = require("../models/userModel");
const http = require("../models/httpStatus");

const register = async (req, res) => {
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

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const User = await user.findOne({ email });
    if (!User)
      return res
        .status(http.BAD_REQUEST)
        .json({ message: "Incorrect email or password", success: false });

    const isMatch = await bcrypt.compare(String(password), User.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Incorrect email or password", success: false });

    const token = jwt.sign({ id: User._id }, process.env.JWT_Secret, {
      expiresIn: "1d",
    });

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: false, // true in production with https
        sameSite: "lax",
      })
      .cookie("userId", user._id, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      })
      .status(200)
      .json({ message: "Login successful", success: true, role: User.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};
const logout = async (req, res) => {
  res
    .cookie("token", "", { maxAge: 0 })
    .json({ message: "Logout successful", success: true });
};
module.exports = { register, login, logout };
