const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated"
    });
  }

  try {

    const decoded = jwt.verify(token, process.env.SECRET_KEY,);

    req.userId = decoded.userId;

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });

  }

};

module.exports = authMiddleware;