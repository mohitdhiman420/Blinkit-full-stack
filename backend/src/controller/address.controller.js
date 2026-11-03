const addressmodel = require("../models/address.model");
const usermodel = require("../models/user.model");

async function Addaddress(req, resp) {
  try {
    const { address_line, city, state, pincode, country, mobile } = req.body;
    const userid = req.user?._id;
    const addaddresss = await addressmodel.create({
      address_line,
      city,
      state,
      pincode,
      country,
      mobile,
      userId: userid,
    });

    const addUserAddressId = await usermodel.findByIdAndUpdate(userid, {
      $push: {
        address_details: addaddresss._id,
      },
    });
    return resp.status(201).json({
      message: "Save Address Success",
      success: true,
      error: false,
      data: addaddresss,
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

async function Getuseraddress(req, resp) {
  try {
    const userid = req.user?._id;
    if(!userid){
     return resp.status(400).json({
      message: "please Login First",
      error: true,
      success: false,
    });
    }

    const getuseraddress = await addressmodel.find({userId:userid})
    return resp.json({
      message: "Your address get success",
      success: true,
      error: false,
      data: getuseraddress,
    });

  } catch (error) {
    return resp.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

async function Updateaddress(req,resp) {
  try {
    const { id,address_line, city, state, pincode, country, mobile } = req.body;
    const userid = req.user?._id;
    const updateaddresss = await addressmodel.updateOne({_id:id,userId: userid},{      
      address_line,
      city,
      state,
      pincode,
      country,
      mobile,
    });

    
    return resp.status(201).json({
      message: "update Address Success",
      success: true,
      error: false,
      data: updateaddresss,
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

async function Disableordeleteaddress(req,resp) {
  try {
    const { id } = req.body;
    const userid = req.user?._id;
    const Disableaddresss = await addressmodel.updateOne({_id:id,userId: userid},{      
     status:false
    });

    
    return resp.status(201).json({
      message: "Delete Address Success",
      success: true,
      error: false,
      data: Disableaddresss,
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}


module.exports = { Addaddress,Getuseraddress,Updateaddress,Disableordeleteaddress };
