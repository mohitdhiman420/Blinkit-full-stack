const { default: mongoose } = require("mongoose");
const cartmodel = require("../models/cart.model");
const ordermodel = require("../models/order.model");
const usermodel = require("../models/user.model");

async function cashondelivery(req, resp) {
  try {
    const userid = req.user?._id;
    const { list_items, totalAmt, addressId, subTotalAmt } = req.body;
    console.log(list_items);

    const payload = list_items.map((el) => {
      return {
        userId: userid,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: el.productId._id,
        product_details: {
          name: el.productId.name,
          image: el.productId.image,
        },
        paymentId: "",
        payment_status: "CASH ON DELIVERY",
        delivery_address: addressId,
        subTotalAmt: subTotalAmt,
        totalAmt: totalAmt,
      };
    });

    // ye isliye taki hm multiple item ko ek order m create kar paye 
    const generatedOrder = await ordermodel.insertMany(payload)

    // ye isliye h taki user jab order kar de to cart m se item remove kar de

    const removeCartItems = await cartmodel.deleteMany({ userId: userid });
    const updateInUser = await usermodel.updateOne(
      { _id: userid },
      { shopping_cart: [] },
    );

    return resp.json({
      message: "Order successfully",
      error: false,
      success: true,
      data: generatedOrder,
    });
  } catch (error) {
    return resp.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}


async function getorderdetails(req,resp) {
   try {
       const userid = req.user?._id;

        const orderlist = await ordermodel.find({ userId : userid }).sort({ createdAt : -1 }).populate('delivery_address')

        return resp.json({
            message : "order list",
            data : orderlist,
            error : false,
            success : true
        })
    } catch (error) {
        return resp.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

module.exports = { cashondelivery ,getorderdetails };
