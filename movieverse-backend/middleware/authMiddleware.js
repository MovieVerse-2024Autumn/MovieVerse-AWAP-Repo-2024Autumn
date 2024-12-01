import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization; // Get the Authorization header
  const token = authHeader && authHeader.split(" ")[1]; // Extract the token

  // If no token is provided, deny access
  if (!token) {
    console.error("Access Denied: No token provided");
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token successfully decoded:", decoded); // Debugging log
    req.user = decoded; // Attach user info (e.g., userId, email) to the request object
    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    console.error("Invalid or expired token:", error.message); // Debugging log
    // Differentiate between expired and invalid token errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired. Please log in again." });
    } else {
      return res.status(403).json({ message: "Invalid or malformed token." });
    }
  }
};
