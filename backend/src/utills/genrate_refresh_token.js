const jwt = require("jsonwebtoken");
const usermodel = require("../models/user.model");

async function genrate_refresh_token(userid) {
  const token = await jwt.sign({ id: userid }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  
  const update_token = await usermodel.updateOne({_id:userid},{refresh_token:token})
  return token;
}


module.exports = genrate_refresh_token