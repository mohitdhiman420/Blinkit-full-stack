import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaMinus, FaPlus } from "react-icons/fa6";

import { useGlobalcontext } from "../provider/Globalcontext";
import { useSelector } from "react-redux";

function AddtoCartBtn({ data }) {
  const [isAvailableCart, setIsAvailableCart] = useState(false);
  const [qty, setqty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cartItemDetails, setCartItemsDetails] = useState();

  const { getallcartitem, updatecartitem, deletecartitem } = useGlobalcontext();

  const cartitem = useSelector((state) => state.cartitem.cart);

  const handleADDTocart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/cart/cartproduct/addcart",
        {
          productId: data?._id,
        },
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        toast.success("Added To cart");
        if (getallcartitem) {
          getallcartitem();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkisav = cartitem.some((item) => item.productId._id == data._id);
    const cartit = cartitem.find((item) => item.productId._id == data._id);
    setqty(cartit?.quantity);
    setCartItemsDetails(cartit);
    setIsAvailableCart(checkisav);
  }, [data, cartitem]);

  const increaseQty = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const response = await updatecartitem(cartItemDetails?._id, qty + 1);

    if (response.success) {
      toast.success("Item added");
    }
  };

  const decreaseQty = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (qty == 1) {
      deletecartitem(cartItemDetails?._id);
    } else {
      const response = await updatecartitem(cartItemDetails?._id, qty - 1);

      if (response.success) {
        toast.success("Item Remove");
      }
    }
  };
  return (
    <div className="w-full max-w-[150px]">
      {isAvailableCart ? (
        <div className="flex w-full h-full">
          <button
            onClick={decreaseQty}
            className="bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded flex items-center justify-center"
          >
            <FaMinus />
          </button>

          <p className="flex-1 w-full font-semibold px-1 flex items-center justify-center">
            {qty}
          </p>

          <button
            onClick={increaseQty}
            className="bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded flex items-center justify-center"
          >
            <FaPlus />
          </button>
        </div>
      ) : (
        <button
          onClick={handleADDTocart}
          className="bg-green-600 hover:bg-green-700 text-white px-2 lg:px-4 py-1 rounded"
        >
          {loading ? "Loading ..." : "Add"}
        </button>
      )}
    </div>
  );
}

export default AddtoCartBtn;
