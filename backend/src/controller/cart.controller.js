const usermodel = require("../models/user.model");
const cartmodel = require("../models/cart.model");

async function Addtocart(req, resp) {
  try {
    const { productId } = req.body;
    const userid = req.user?._id; // iske liye hme route m authmiddleware add karna hota h nahi to user id nhi milti

    if (!productId) {
      return resp.status(400).json({
        message: "Please provide product id ",
        error: true,
        success: false,
      });
    }

    const checkcartalreadyornot = await cartmodel.findOne({
      productId: productId,
      userId: userid,
    });

    if (checkcartalreadyornot) {
      return resp.status(400).json({
        message: " This item already added to cart",
        success: false,
        error: true,
      });
    }

    const newcartproduct = await cartmodel.create({
      quantity: 1,
      userId: userid,
      productId: productId,
    });
    const updateCartUser = await usermodel.updateOne(
      { _id: userid },
      {
        $push: {
          shopping_cart: productId,
        },
      },
    );
    return resp.status(201).json({
      message: " This product Add to cart Success",
      success: true,
      error: false,
      data: newcartproduct,
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

async function getcartitems(req, resp) {
  try {
    const userid = req.user?._id;

    const cartitems = await cartmodel
      .find({ userId: userid })
      .populate("productId");

    return resp.json({
      data: cartitems,
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

async function updateqtycartproduct(req, resp) {
  try {
    const userid = req.user?._id;
    const { id, qty } = req.body;

    if (!id || !qty) {
      return resp.status(400).json({
        message: "Please provide Quantity or login id ",
        success: false,
        error: true,
      });
    }

    const updateqty = await cartmodel.updateOne(
      { _id: id, userId: userid },
      { quantity: qty },
    );
    return resp.json({
      data: updateqty,
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

async function deletecartitam(req, resp) {
  try {
    const userid = req.user?._id;
    const { id } = req.body;

    if (!id) {
      return resp.status(400).json({
        message: "Please provide id",
        success: false,
        error: true,
      });
    }

    const delcartitem = await cartmodel.deleteOne({ _id: id, userId: userid });
    return resp.json({
      data: delcartitem,
      message: "Item Remove",
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
  Addtocart,
  getcartitems,
  updateqtycartproduct,
  deletecartitam,
};
