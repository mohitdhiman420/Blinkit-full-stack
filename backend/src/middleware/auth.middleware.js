const usermodel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function authmiddleware(req, resp, next) {
  try {
    
    const token =(await req.cookies?.accesstoken) || req.headers.authorization?.split(" ")[1];
    // console.log("middleware token access" + token);

    if (!token) {
      return resp.status(400).json({
        message: "provide token",
        error: true,
        success: false,
      });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return resp.status(401).json({
        message: "unauthorised access token",
        error: true,
        success: false,
      });
    }
    const user = await usermodel.findById(decoded.id);
    req.user = user;
    
    next();


  } catch (error) {
    return resp.status(500).json({
      message: "Please Log in First",
      // message: error.message || error,
      error: true,
      success: false,
    });
  }
}


async function CheckAdmin(req, resp, next) {
  const admin = req.user.role;
  if (admin != "admin") {
    return resp.status(400).json({
      message: "please log in as Admin",
    });
  }
  next();
  console.log(admin);
}
module.exports = {authmiddleware,CheckAdmin}
