const express = require("express")
const { authmiddleware } = require("../middleware/auth.middleware")
const { Addaddress,Getuseraddress,Updateaddress,Disableordeleteaddress } = require("../controller/address.controller")


const addressrouter = express.Router()

addressrouter.post("/add-address",authmiddleware,Addaddress)
addressrouter.get("/get-address",authmiddleware,Getuseraddress)
addressrouter.post("/update-address",authmiddleware,Updateaddress)
addressrouter.post("/delete-address",authmiddleware,Disableordeleteaddress)

module.exports = addressrouter