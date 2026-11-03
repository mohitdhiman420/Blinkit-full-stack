const { verify } = require("jsonwebtoken");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "provide name"],
  },
  email: {
    type: String,
    require: [true, "provide email"],
    unique: true,
  },
  password: {
    type: String,
    require: [true, "provide password"],
  },
  avatar: {
    type: String,
    default: "",
  },
  mobile: {
    type: Number,
    default: null,
  },

  refresh_token: {
    type: String,
    default: "",
  },

  verify_email: {
    type: Boolean,
    default: false,
  },
  last_login_details: {
    type: Date,
    default: "",
  },
  status: {
    type: String,
    enum : ["Active","Inactive","Suspanded"],
    default: "Active",
  },

  address_details:[
     {
          type:mongoose.Schema.ObjectId,
          ref:"address"
     }
  ],
  shopping_cart:[
     {
          type:mongoose.Schema.ObjectId,
          ref:"cartProduct"
     }
  ],
  order_history:[
     {
          type:mongoose.Schema.ObjectId,
          ref:"order"
     }
  ],
  forgot_password_otp:{
     type:String,
     default:null
  },
  forgot_password_otp_expire:{
     type:Date,
     default:""
  },
  role:{
     type:String,
     enum:["user","admin"],
     default:"user"
  },
  
 
},{
     timestamps:true
});

const usermodel = mongoose.model("user",userSchema)

module.exports = usermodel