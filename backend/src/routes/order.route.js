const express = require("express")
const { authmiddleware } = require("../middleware/auth.middleware")
const { cashondelivery,getorderdetails } = require("../controller/order.controller")

const orderrouter = express.Router()

orderrouter.post("/cash-on-delivery",authmiddleware,cashondelivery)
orderrouter.get("/order-details",authmiddleware,getorderdetails)


module.exports = orderrouter