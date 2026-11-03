const express = require("express")
const { Addtocart,getcartitems,updateqtycartproduct,deletecartitam } = require("../controller/cart.controller")
const { authmiddleware } = require("../middleware/auth.middleware")

const cartrouter = express.Router()

cartrouter.post("/cartproduct/addcart",authmiddleware,Addtocart)
cartrouter.get("/cartproduct/getcartproduct",authmiddleware,getcartitems)
cartrouter.post("/cartproduct/updatecartproduct",authmiddleware,updateqtycartproduct)
cartrouter.post("/cartproduct/deletecartproduct",authmiddleware,deletecartitam)


module.exports = cartrouter