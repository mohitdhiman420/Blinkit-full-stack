import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useGlobalcontext } from "../provider/Globalcontext";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import Addaddress from "../component/Addaddress";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom'

function CheckoutPage() {
  const addressList = useSelector((state) => state.address.addressList);
  const cartitem = useSelector((state) => state.cartitem.cart);

  const [openAddress, setOpenAddress] = useState(false);
  const [selectAddress, setSelectAddress] = useState(0);
  const { totalprice, totalqty, NotDiscountTotalPrice, getallcartitem,fetchOrder } =useGlobalcontext();

  const navigate = useNavigate()

  // isme online payment ki api k liye stripe ka use h uski help se bnage 
  const handleCashOnDelivery = async () => {
    // console.log();
    //list_items, totalAmt, addressId, subTotalAmt
    try {
      const response = await axios.post(
        "http://localhost:5000/api/order/cash-on-delivery",
        {
          list_items: cartitem,
          totalAmt: totalprice,
          addressId: addressList[selectAddress]?._id,
          subTotalAmt: totalprice,
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
        if(fetchOrder){
          fetchOrder()
        }

        navigate('/success',{
                state : {
                  text : "Order"
                }
              })
      }
    } catch (error) {
      toast.error(error.response?.data.message);
    }
  };
  return (
    <section className="bg-blue-50">
      <div className="container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between">
        <div className="w-full">
          {/***address***/}
          <h3 className="text-lg font-semibold">Choose your address</h3>
          <div className="bg-white p-2 grid gap-4">
            {addressList.map((address, index) => {
              return (
                <label
                  htmlFor={"address" + index}
                  className={!address.status && "hidden"}
                >
                  <div className="border rounded p-3 flex gap-3 hover:bg-blue-50">
                    <div>
                      <input
                        id={"address" + index}
                        type="radio"
                        value={index}
                        onChange={(e) => setSelectAddress(e.target.value)}
                        name="address"
                      />
                    </div>
                    <div>
                      <p>{address.address_line}</p>
                      <p>{address.city}</p>
                      <p>{address.state}</p>
                      <p>
                        {address.country} - {address.pincode}
                      </p>
                      <p>{address.mobile}</p>
                    </div>
                  </div>
                </label>
              );
            })}
            <div
              onClick={() => setOpenAddress(true)}
              className="h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer"
            >
              Add address
            </div>
          </div>
        </div>

        <div className="w-full max-w-md bg-white py-4 px-2">
          {/**summary**/}
          <h3 className="text-lg font-semibold">Summary</h3>
          <div className="bg-white p-4">
            <h3 className="font-semibold">Bill details</h3>
            <div className="flex gap-4 justify-between ml-1">
              <p>Items total</p>
              <p className="flex items-center gap-2">
                <span className="line-through text-neutral-400">
                  {DisplayPriceInRupees(NotDiscountTotalPrice)}
                </span>
                <span>{DisplayPriceInRupees(totalprice)}</span>
              </p>
            </div>
            <div className="flex gap-4 justify-between ml-1">
              <p>Quntity total</p>
              <p className="flex items-center gap-2">{totalqty} item</p>
            </div>
            <div className="flex gap-4 justify-between ml-1">
              <p>Delivery Charge</p>
              <p className="flex items-center gap-2">Free</p>
            </div>
            <div className="font-semibold flex items-center justify-between gap-4">
              <p>Grand total</p>
              <p>{DisplayPriceInRupees(totalprice)}</p>
            </div>
          </div>
          <div className="w-full flex flex-col gap-4">
            <button
              className="py-2 px-4 bg-green-600 hover:bg-green-700 rounded text-white font-semibold"
              onClick={"handleOnlinePayment"}
            >
              Online Payment
            </button>

            <button
              className="py-2 px-4 border-2 border-green-600 font-semibold text-green-600 hover:bg-green-600 hover:text-white"
              onClick={handleCashOnDelivery}
            >
              Cash on Delivery
            </button>
          </div>
        </div>
      </div>

      {openAddress && <Addaddress close={() => setOpenAddress(false)} />}
    </section>
  );
}

export default CheckoutPage;
