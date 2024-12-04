import jwt from "jsonwebtoken";
import userModel from "../../models/User.js";
import ApiError from "../../middleware/ApiError.js";
import bcrypt from "bcrypt";
import { pool } from "../../middleware/db.js";

const register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const existingUser = await userModel.findUserByEmail(email);

    if (existingUser) {
      return next(new ApiError(400, "User already exists"));
    }
    const uniqueUrl = `${Math.random()
      .toString(36)
      .substring(2, 8)}-${lastName.toLowerCase()}-${Date.now()
      .toString()
      .substring(4, 7)}`;

    const newUser = await userModel.createUser(
      email,
      password,
      firstName,
      lastName,
      uniqueUrl
    );
    res.status(201).json({
      message: "User registered successfully",
      user: { ...newUser, profileUrl: uniqueUrl },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findUserByEmail(email);

    if (!user) {
      return next(new ApiError(400, "Invalid email or password"));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(new ApiError(400, "Invalid email or password"));
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, profileUrl: user.unique_profile_url },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.status(200).json({
      token,
      profileUrl: user.unique_profile_url,
      firstName: user.first_name, // Send the user's first name in the response
      lastName: user.last_name,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error.message);
    next(error);
  }
};

export const deleteAccount = async (req, res) => {
  const userId = req.user.id; // Extract user ID from authenticated token
  const { reason, password } = req.body;

  try {
    // Check if the user exists
    const userCheck = await pool.query("SELECT * FROM account WHERE id = $1", [
      userId,
    ]);
    if (userCheck.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate password
    const user = userCheck.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Delete the user
    await pool.query("DELETE FROM account WHERE id = $1", [userId]);

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default { register, login };
