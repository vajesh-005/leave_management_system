const jwt = require("jsonwebtoken");
require("dotenv").config();
exports.verifyToken = async (request, h) => {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return h.response("Missing or invalid token ").code(401).takeover();
//check condition !!!
  try {
    const token = authHeader.split(" ")[1];
    console.log("printed from verification", token);
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET is not defined in .env");
      return h.response("Server misconfiguration").code(500).takeover();
    }

    const decoded = jwt.verify(token, secret);
    request.auth = { credentials: decoded };
    console.log(decoded, "decoded");
    return h.continue;
  } catch (error) {
    console.log("error occurred in verification ", error.message);
    return h.response("Invalid or expired token").code(401).takeover();
  }
};
