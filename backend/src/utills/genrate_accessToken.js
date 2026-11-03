const jwt = require("jsonwebtoken")

async function genrate_access_token(userid) {

     const token = await jwt.sign({id:userid}
          ,process.env.JWT_SECRET,
          {expiresIn:'7h'})

          return token
     
}

module.exports = genrate_access_token