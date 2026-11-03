const express = require("express");

const {
  userregister,
  verifyemailcontroller,
  user_login,
  userlogout,
  upload_avtar_image,
  update_user_details,
  forgot_password_user,
  verify_forgot_password,
  create_new_password,
  refreshtoken,
  loginuserdetils,
} = require("../controller/user.controller");
const {authmiddleware} = require("../middleware/auth.middleware");
const upload = require("../db/multer");

const router = express.Router();

router.post("/user/register", userregister);
router.post("/user/verifyemail", verifyemailcontroller);
router.post("/user/login", user_login);
router.post("/user/logout", authmiddleware, userlogout);
router.post("/user/upload_avtar",authmiddleware,upload.single("avatar"),upload_avtar_image);
router.post("/user/updateuser", authmiddleware, update_user_details);
router.post("/user/forgot-password", forgot_password_user);
router.post("/user/verify-forgot-password", verify_forgot_password);
router.post("/user/reset-password", create_new_password);
router.post("/user/refresh-token",refreshtoken);
router.get("/user/user-detils",authmiddleware,loginuserdetils)

module.exports = router;
