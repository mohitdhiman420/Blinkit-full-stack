const express = require("express")
const { Addsubcategory,getallsubcategory,UpdateSubcategory,deletesubcategory } = require("../controller/subcategory.controller")
const {authmiddleware,CheckAdmin} = require("../middleware/auth.middleware")

const subcatrouter = express.Router()
subcatrouter.post("/addsubcategory",authmiddleware,CheckAdmin,Addsubcategory)
subcatrouter.get("/getsubcategory",getallsubcategory)
subcatrouter.post("/updatesubcategory",authmiddleware,CheckAdmin,UpdateSubcategory)
subcatrouter.post("/deletesubcategory",authmiddleware,CheckAdmin,deletesubcategory)

module.exports = subcatrouter