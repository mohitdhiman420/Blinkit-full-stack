const express = require("express")
const { uploadimagecontroller } = require("../controller/uploadimage.controller")
const upload = require("../db/multer")

const upoloadimagerouter = express.Router()

upoloadimagerouter.post('/uploadimage',upload.single("image"),uploadimagecontroller)

module.exports = upoloadimagerouter