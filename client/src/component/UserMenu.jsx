import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Divider from "./Divider";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { logout, userDetails } from "../store/userSlice";
import { FaExternalLinkAlt } from "react-icons/fa";

function UserMenu({ setusermenu }) {
  const user = useSelector((state) => state.user);
  const isAdmin = user.role == "admin" ? true : false;
  // console.log("this chek profile", user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClose = () => {
  setusermenu(false);
};

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/user/logout",
        {},
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        toast.success("User Logout Successfully!");
        localStorage.clear();
        dispatch(logout());
        if (setusermenu) {
          setusermenu(false);
        }
        navigate("/");

        //    localStorage.setItem("refreshtoken", response.data.data.refreshToken);
      }
    } catch (error) {
      // console.log(error);

      toast.error(error.response?.data.message);
    }
  };
  return (
    <div className="">
      <div className="font-semibold">My Account</div>
      <div className="flex gap-2 items-center">
        <h3 className="text-md font-black">
          {user.name.charAt(0).toUpperCase() + user.name?.slice(1) ||
            user.email}
          {user.role == "admin" && (
            <span className="text-red-500">(Admin)</span>
          )}
        </h3>
           
        <Link to={"/dashboard/profile"} onClick={handleClose}>
          <FaExternalLinkAlt size={15} />
        </Link>
      </div>

      <div className="py-1">
        <Divider />
        <div className="text-md flex flex-col gap-[0.5px] mt-1 px-2">
          {isAdmin && (
            <Link to={"/dashboard/category"} onClick={handleClose} className="hover:bg-orange-200">
              Category
               
            </Link>
          )}

          {isAdmin && (
            <Link
              to={"/dashboard/sub-category"} onClick={handleClose}  
              className="hover:bg-orange-200"
            >
              Sub Category
            </Link>
          )}

          {isAdmin && (
            <Link
              to={"/dashboard/upload-product"} onClick={handleClose}
              className="hover:bg-orange-200"
            >
              Upload Product
            </Link>
          )}

          {isAdmin && (
            <Link to={"/dashboard/products"} onClick={handleClose} className="hover:bg-orange-200">
              Products
            </Link>
          )}

          <Link to={"/dashboard/my-order"} onClick={handleClose} className="hover:bg-orange-200">
            My Orders
          </Link>
          <Link to={"/dashboard/address"} onClick={handleClose} className="hover:bg-orange-200">
            Save Address
          </Link>
          <Link to={""} onClick={handleClose} className="hover:bg-orange-200" onClick={handleLogout}>
            Log Out
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UserMenu;
