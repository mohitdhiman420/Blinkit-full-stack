import axios from "axios";
import { useContext, useEffect } from "react";
import { createContext } from "react";
import { handleaddcart } from "../store/cartSlice";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { pricewithDiscount } from "../utils/pricewithDiscount";
import { handleaddaddress } from "../store/addressSlice";
import { setOrder } from "../store/orderSlice";

export const Globalcontext = createContext(null);

export const useGlobalcontext = () => useContext(Globalcontext);

const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch();

  const [totalprice, settotalprice] = useState(0);
  const [totalqty, settotalqty] = useState(0);
  const [NotDiscountTotalPrice, setNotDiscountTotalPrice] = useState(0);
  const cartitem = useSelector((state) => state.cartitem.cart);
  const user = useSelector((state) => state.user);

  async function getallcartitem() {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/cart/cartproduct/getcartproduct",

        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        dispatch(handleaddcart(response.data.data));
      }
    } catch (error) {
      toast.error(error.response?.data.message);
    }
  }

  async function updatecartitem(id, qty) {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/cart/cartproduct/updatecartproduct",
        {
          id: id,
          qty: qty,
        },

        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        if (getallcartitem) {
          getallcartitem();
        }
        return response.data;
        // dispatch(handleaddcart(response.data.data));
      }
    } catch (error) {
      toast.error(error.response?.data.message);
    }
  }

  async function deletecartitem(id) {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/cart/cartproduct/deletecartproduct",
        {
          id: id,
        },

        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        toast.success(response.data.message);
        if (getallcartitem) {
          getallcartitem();
        }
        // dispatch(handleaddcart(response.data.data));
      }
    } catch (error) {
      toast.error(error.response?.data.message);
    }
  }

  const Getaddressall = async (data) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/address/get-address",

        {
          withCredentials: true,
        },
      );
      if (response.data.success) {
        dispatch(handleaddaddress(response.data.data));
      }
    } catch (error) {
      toast.error(error.response?.data.message);
    }
  };

  const fetchOrder = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/order/order-details",

        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        dispatch(setOrder(response.data.data));
      }
    } catch (error) {
      toast.error(error.response?.data.message);
    }
  };

  useEffect(() => {
    if (!user._id) return;
    if (getallcartitem) {
      getallcartitem();
    }
  }, []);

  useEffect(() => {
    const qty = cartitem.reduce((preve, curr) => {
      return preve + curr.quantity;
    }, 0);
    settotalqty(qty);

    const totprice = cartitem.reduce((preve, curr) => {
      return (
        preve +
        pricewithDiscount(curr.productId.price, curr.productId.discount) *
          curr.quantity
      );
    }, 0);
    settotalprice(totprice);

    const notDiscountPrice = cartitem.reduce((preve, curr) => {
      return preve + curr.productId.price * curr.quantity;
    }, 0);
    setNotDiscountTotalPrice(notDiscountPrice);
  }, [cartitem]);

  // ye code isliye h taki user ager log in ho to cart data aa jaye useeffect b isme kaam karta h
  const handlelogout = () => {
    localStorage.clear();
    dispatch(handleaddcart([]));
  };

  useEffect(() => {
    if (!user._id) return;
    getallcartitem();
    Getaddressall();
    fetchOrder();
    handlelogout();
  }, [user]);

  return (
    <Globalcontext.Provider
      value={{
        getallcartitem,
        updatecartitem,
        deletecartitem,
        Getaddressall,
        fetchOrder,
        totalprice,
        totalqty,
        NotDiscountTotalPrice,
      }}
    >
      {children}
    </Globalcontext.Provider>
  );
};

export default GlobalProvider;
