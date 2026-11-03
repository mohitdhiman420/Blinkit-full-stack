const usermodel = require("../models/user.model");

const bcryptjs = require("bcryptjs");

const sendEmail = require("../db/sendEmail");
const verifyEmailTemplate = require("../utills/verify_email_temp");
const genrate_access_token = require("../utills/genrate_accessToken");
const genrate_refresh_token = require("../utills/genrate_refresh_token");
const uploadImageClodinary = require("../db/cloudinary");
const upload = require("../db/multer");
const { default: generatedOtp } = require("../utills/genrate_otp");
const forgot_pass_temp = require("../utills/forgot_password_temp");

async function userregister(req, resp) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return resp.status(400).json({
        message: "Provide email password ",
        error: true,
        success: false,
      });
    }

    console.log(name);

    const user = await usermodel.findOne({ email });
    console.log(user);

    if (user) {
      return resp.status(400).json({
        message: "user already exist plase log in  ",
        error: true,
        success: false,
      });
    }

    const hash_pass = await bcryptjs.hash(password, 10);
    const newuser = await usermodel.create({
      name,
      email,
      password: hash_pass,
      role,
    });

    //     const VerifyEmailUrl = "";
    const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${newuser?._id}`;
    // console.log(VerifyEmailUrl)

    const verify_email = await sendEmail({
      sendto: email,
      subject: "Verify Email From Blinkit",
      html: verifyEmailTemplate({
        name,
        url: VerifyEmailUrl,
      }),
    });

    // console.log(verify_email);

    return resp.status(201).json({
      message: "User created Success",
      error: false,
      success: true,
      data: newuser,
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

async function verifyemailcontroller(req, resp) {
  try {
    const { code } = req.body;

    const user = await usermodel.findOne({ _id: code });
    // console.log("user update " + user);

    if (!user) {
      return resp.status(400).json({
        message: "user code not found",
        error: true,
        success: false,
      });
    }
    const updateuser = await usermodel.updateOne(
      { _id: code },
      { verify_email: true },
    );
    return resp.status(400).json({
      message: "verify email ",
      error: false,
      success: true,
    });

    // console.log(updateuser);
  } catch (error) {}
}

async function user_login(req, resp) {
  try {
    const { email, password } = req.body;

    const user = await usermodel.findOne({ email });
    if (!user) {
      return resp.status(400).json({
        message: "user Not Regester",
        error: true,
        success: false,
      });
    }
    if (user.status !== "Active") {
      return resp.status(400).json({
        message: "user Not Active Contact Admin",
        error: true,
        success: false,
      });
    }

    const pass_com = await bcryptjs.compare(password, user.password);

    if (!pass_com) {
      return resp.status(400).json({
        message: "password incorrect ",
        error: true,
        success: false,
      });
    }
    const accessToken = await genrate_access_token(user._id);
    const refreshToken = await genrate_refresh_token(user._id);

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    resp.cookie("accesstoken", accessToken, cookiesOption);
    resp.cookie("refreshtoken", refreshToken, cookiesOption);

    const udateuser = await usermodel.findByIdAndUpdate(user._id, {
      last_login_details: new Date(),
    });

    return resp.status(200).json({
      message: "Login Success ",
      error: false,
      success: true,
      data: {
        accessToken,
        refreshToken,
        user,
      },
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

async function userlogout(req, resp) {
  try {
    const userid = req.user._id;
    // console.log("this is another user " + userid._id);`

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    resp.clearCookie("accesstoken", cookiesOption);
    resp.clearCookie("refreshtoken", cookiesOption);

    const removerefreshToken = await usermodel.findByIdAndUpdate(userid, {
      refresh_token: "",
    });
    return resp.json({
      message: "User Logout Success",
      error: false,
      success: true,
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
async function upload_avtar_image(req, resp) {
  try {
    const userid = req.user._id;

    const image = req.file;
    // console.log(image);

    //  const upload = await uploadImageClodinary(image)
    const upload = await uploadImageClodinary(req.file);
    // console.log("Upload Result:", upload);

    const updateavtar = await usermodel.findByIdAndUpdate(
      userid,
      {
        avatar: upload.url,
      },
      {
        new: true,
      },
    );

    // console.log(updateavtar);

    return resp.status(200).json({
      message: "image upload success",
      data: {
        _id: userid,
        avatar: updateavtar,
      },
      error: false,
      success: true,
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

async function update_user_details(req, resp) {
  try {
    const { name, email, mobile, password } = req.body;
    if (!name || !email) {
      return resp.status(400).json({
        message: "provide name email password mobile",
        error: true,
        success: false,
      });
    }

    const userid = req.user._id;

    // console.log("for name", name);
    // console.log("for name", email);
    // console.log("for name", mobile);

    let hash_pass;

    if (password) {
      hash_pass = await bcryptjs.hash(password, 10);
    }

    //

    const updatedetails = await usermodel.findByIdAndUpdate(
      userid,
      {
        ...(name && { name: name }),
        ...(email && { email: email }),
        ...(mobile && { mobile: mobile }),
        ...(password && { password: hash_pass }),
      },
      { new: true },
    );

    return resp.status(200).json({
      message: "user update successs",
      data: updatedetails,
      error: false,
      success: true,
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

async function forgot_password_user(req, resp) {
  try {
    const { email } = req.body;

    if (!email) {
      return resp.status(400).json({
        message: "provide email",
        error: true,
        success: false,
      });
    }

    const user = await usermodel.findOne({ email });
    if (!user) {
      return resp.status(400).json({
        message: "user email not found",
        error: true,
        success: false,
      });
    }

    const otp = generatedOtp();
    const otp_expire = new Date(Date.now() + 10 * 60 * 1000);

    const update_otp = await usermodel.findByIdAndUpdate(user._id, {
      forgot_password_otp: otp,
      forgot_password_otp_expire: otp_expire,
    });

    await sendEmail({
      sendto: email,
      subject: "Forgot password from Binkeyit",
      html: forgot_pass_temp({
        name: user.name,
        otp: otp,
      }),
    });

    return resp.status(200).json({
      message: "otp send to mail",
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

async function verify_forgot_password(req, resp) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return resp.status(400).json({
        message: "enter email or OTP",
        error: true,
        success: false,
      });
    }

    const user = await usermodel.findOne({ email });
    if (!user) {
      return resp.status(400).json({
        message: "user NOT Found",
        error: true,
        success: false,
      });
    }

    const currentTime = new Date().toISOString();

    if (currentTime < user.forgot_password_otp_expire) {
      return resp.status(400).json({
        message: "OTP is Expired",
        error: true,
        success: false,
      });
    }

    const userotp = user.forgot_password_otp;
    console.log(userotp);
    console.log(otp);

    if (otp != user.forgot_password_otp) {
      return resp.status(400).json({
        message: "OTP incorrect",
        error: true,
        success: false,
      });
    }

    const update_otp = await usermodel.findByIdAndUpdate(user._id, {
      forgot_password_otp: "",
      forgot_password_otp_expire: "",
    });

    return resp.status(200).json({
      message: "OTP verify Success",
      error: false,
      success: true,
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

async function create_new_password(req, resp) {
  try {
    const { email, new_password, confirm_password } = req.body;
    // console.log(email);
    // console.log(new_password);
    // console.log(confirm_password);

    if (!email || !new_password || !confirm_password) {
      return resp.status(400).json({
        message: "provide email,password , confirm password",
        error: true,
        success: false,
      });
    }
    const user = await usermodel.findOne({ email });
    if (!user) {
      return resp.status(400).json({
        message: "user email not found",
        error: true,
        success: false,
      });
    }
    if (new_password != confirm_password) {
      return resp.status(400).json({
        message: "new_password or confirm password not match",
        error: true,
        success: false,
      });
    }

    const hashpass = await bcryptjs.hash(new_password, 10);

    const update_passwod = await usermodel.findByIdAndUpdate(user._id, {
      password: hashpass,
    });

    return resp.status(200).json({
      message: "New Password updated successfully.",
      error: false,
      success: true,
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

async function refreshtoken(req, resp) {
  try {
    const refreshToken =
      req.cookies.refreshtoken || req?.headers?.authorization?.split(" ")[1];

    if (!refreshToken) {
      return resp.status(400).json({
        message: "invalid token",
        error: true,
        success: false,
      });
    }
    const decoded = await jwt.verify(refreshToken, process.env.JWT_SECRET);
    if (!decoded) {
      return resp.status(400).json({
        message: "token is expire",
        error: true,
        success: false,
      });
    }

    const new_accesstoken = await genrate_refresh_token(decoded._id);
    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    resp.cookie("accesstoken", new_accesstoken, cookiesOption);

    return resp.json({
      message: "New Access token generated",
      error: false,
      success: true,
      data: {
        accesstoken: new_accesstoken,
      },
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

async function loginuserdetils(req, resp) {
  try {
    const userid = req.user._id;

    const userdetails = await usermodel
      .findById(userid)
      .select("-password -refresh_token");

    return resp.status(200).json({
      message: "User Details Get successfully.",
      data: userdetails,
      error: false,
      success: true,
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = {
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
};
