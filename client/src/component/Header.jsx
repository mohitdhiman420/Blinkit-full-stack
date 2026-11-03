import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import Search from "./Search";
import {
  Link,
  Navigate,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import useMobile from "../hooks/UseMobile";
import { BsCart4 } from "react-icons/bs";
import { useSelector } from "react-redux";
import { FaCaretDown } from "react-icons/fa6";
import { IoCaretUp } from "react-icons/io5";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";

import UserMenu from "./UserMenu";
import { useGlobalcontext } from "../provider/Globalcontext";
import Displaycartitem from "./Displaycartitem";

function Header() {
  const location = useLocation();
  const issearch = location.pathname === "/search";
  const ismobile = useMobile();
  const [usermenu, setusermenu] = useState(false);
  const [opencart, setopencart] = useState(false);
  const navigate = useNavigate();

  const {totalprice,totalqty} = useGlobalcontext() // is se ye sab jgha use ho jayega 

  // const [totalprice, settotalprice] = useState(0);
  // const [totalqty, settotalqty] = useState(0);

  // ye sirf store ki value k liye h

  const userdetails = useSelector((state) => state.user);
  const cartitem = useSelector((state) => state.cartitem.cart);


  const handlemobileusericon = () => {
    if (!userdetails?._id) {
      navigate("/login");
    } else if (userdetails?._id) {
      navigate("/user-details");
    }
  };

  // useEffect(() => {
  //   const qty = cartitem.reduce((preve, curr) => {
  //     return preve + curr.quantity;
  //   }, 0);
  //   settotalqty(qty);

  //   const totprice = cartitem.reduce((preve,curr) =>{
  //     return preve + (curr.productId.price * curr.quantity)

  //   },0)
  //   settotalprice(totprice);
    
  // }, [cartitem]);

  // console.log("user details from redux:", userdetails._id);

  return (
    <header className="h-24 lg:h-22 lg:shadow-md sticky top-0 z-40 bg-white flex flex-col justify-center items-center">
      {!(ismobile && issearch) && (
        <div className="container mx-auto flex justify-between items-center px-4 ">
          <div>
            <NavLink to={"/"}>
              <img
                src={logo}
                width={170}
                height={60}
                alt="logo"
                className="hidden lg:block"
              />
              <img
                src={logo}
                width={120}
                height={60}
                alt="logo"
                className="lg:hidden"
              />
            </NavLink>
          </div>

          {/* Search */}
          <div className="hidden lg:block">
            <Search />
          </div>

          {/* log in  */}
          <div className="">
            {/* this for use only mobile */}
            <div className="lg:hidden sm:block" onClick={handlemobileusericon}>
              <FaRegUserCircle size={25} />
            </div>

            {/* this for only desktop version */}
            <div className="hidden lg:block">
              <div className="flex gap-7 items-center">
                {userdetails._id ? (
                  <div className="relative">
                    <div
                      className="flex items-center gap-2 cursor-pointer select-all"
                      onClick={() => setusermenu((prev) => !prev)}
                    >
                      <div className="font-semibold ">Account</div>
                      {/* ye down up trangle h  */}
                      {usermenu ? (
                        <div>
                          <IoCaretUp size={25} />
                        </div>
                      ) : (
                        <div>
                          <FaCaretDown size={25} />
                        </div>
                      )}
                    </div>
                    {usermenu && (
                      <div className="absolute min-w-52 w-full lg:shadow-md bg-white p-4 top-[32px] right-[0px] rounded-md">
                        <UserMenu setusermenu={setusermenu} />
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <Link to={"/login"} className="text-xl">
                      Login
                    </Link>
                  </div>
                )}

                <div onClick={() =>setopencart(true)} className="flex items-center gap-2 bg-green-800 hover:bg-green-700 py-1 font-semibold px-3 rounded-md text-white">
                  <div>
                    <BsCart4 size={26} />
                  </div>
                  <div>
                    {cartitem[0] ? (
                      <div>
                        <p>{totalqty} item</p>
                        <p>{DisplayPriceInRupees(totalprice)}</p>   
                      </div>
                    ) : (
                      <p>My Cart</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* logo */}

      {/* this search for mobile */}
      <div className="container mx-auto px-2 mt-1 lg:hidden">
        <Search />
      </div>


      {opencart && (
        <Displaycartitem close ={ () => setopencart(false)}/>
        // <div>test data aavava</div>
      )}


    </header>
    // <header className="h-24 lg:h-20 lg:shadow-md sticky top-0 z-40 flex flex-col justify-center gap-1 bg-white">
    //   <div className="container mx-auto flex items-center px-2 justify-between">
    //     <div className="h-full">
    //       <NavLink to={"/"}>
    //         <img
    //           src={logo}
    //           width={170}
    //           height={60}
    //           alt="logo"
    //           className="hidden lg:block"
    //         />
    //         <img
    //           src={logo}
    //           width={120}
    //           height={60}
    //           alt="logo"
    //           className="lg:hidden"
    //         />
    //       </NavLink>

    //       <div className="hidden lg:block">
    //         <p>this is search page</p>
    //         {/* <Search /> */}
    //       </div>
    //       {/* <div className="">
    //         <input type="search" name="search" id="search" placeholder="search....." className="border-2 px-2 rounded-lg" />
    //       </div> */}
    //       <div className="">
    //         {/* <div className="flex justify-evenly items-center">
    //           <div className="hidden sm:block">
    //             <FaRegUserCircle size={25} />
    //           </div>
    //           <div className="hidden lg:block">tets</div>
    //         </div> */}
    //       </div>
    //     </div>
    //   </div>
    // </header>
  );
}

export default Header;
