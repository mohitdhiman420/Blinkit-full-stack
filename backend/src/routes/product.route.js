const express = require("express");
const {
  Addproduct,
  Getproduct,
  getproductbycategory,
  getproductbycategoryandsubcategoryid,
  getproductdetails,
  Updateproduct,
  deleteproduct,
  searchproduct
} = require("../controller/productcontroller");
const {authmiddleware,CheckAdmin} = require("../middleware/auth.middleware");

const productrouter = express.Router();

productrouter.post("/Addproduct", authmiddleware,CheckAdmin,Addproduct);
productrouter.post("/getproduct", Getproduct);
productrouter.post("/get-product-bycategory", getproductbycategory);
productrouter.post(
  "/get-product-bycategory-and-subcategory",
  getproductbycategoryandsubcategoryid,
);
productrouter.post("/get-product-details", getproductdetails);
productrouter.post("/update-product-details",authmiddleware,CheckAdmin, Updateproduct);
productrouter.post("/delete-product",authmiddleware,CheckAdmin, deleteproduct);
productrouter.post("/search-product", searchproduct);

module.exports = productrouter;
