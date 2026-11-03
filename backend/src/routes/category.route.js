const express = require("express")
const {authmiddleware,CheckAdmin} = require("../middleware/auth.middleware")
const { Addcategory, getallcategory, Editcategory, Deletecategory } = require("../controller/category.controller")

const categoryrouter = express.Router()

categoryrouter.post("/add-category",authmiddleware,CheckAdmin,Addcategory)
categoryrouter.get("/getcategory",getallcategory)
categoryrouter.post("/editcategory",authmiddleware,CheckAdmin,Editcategory)
categoryrouter.post("/deletecatgory",authmiddleware,CheckAdmin,Deletecategory)


module.exports = categoryrouter