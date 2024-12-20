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

const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    console.log(`Logout: Received token for invalidation: ${token}`);

    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const deleteAccount = async (req, res) => {
  const userId = req.user.id;
  const { reason, password } = req.body;

  console.log("Delete Account Request - User ID:", userId);

  try {
    // Check if the user exists
    const userCheck = await pool.query("SELECT * FROM account WHERE id = $1", [
      userId,
    ]);

    //console.log("User Check Result:", userCheck.rows);

    if (userCheck.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate password
    const user = userCheck.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("Password Valid:", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    console.log(`User ${userId} deleted their account for reason: ${reason}`);

    // Delete the user
    await userModel.deleteUserAccount(userId);

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default { register, login, logout, deleteAccount };
