import { Outlet, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./component/Header";
import Footer from "./component/Footer";

import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userDetails } from "./store/userSlice";
import { setallcategory } from "./store/categorySlice.js";
import {
  setallsubcategory,
  setLoadingCategory,
} from "./store/categorySlice.js";
import fetchuserDetails from "./utils/fetchuser.js";
import axios from "axios";

import { handleaddcart } from "./store/cartSlice.js";
import GlobalProvider from "./provider/Globalcontext.jsx";
import Cartmobile from "./component/Cartmobile.jsx";

function App() {
  const user = useSelector((state) => state.user);
  //   const category = useSelector((state) => state.category);
  // console.log("this is cate data new ",category);

  const dispatch = useDispatch();
  const location = useLocation()

  const fetchuser = async () => {
    const userData = await fetchuserDetails();
    dispatch(userDetails(userData));
  };

  const fetchcategory = async () => {
    try {
      dispatch(setLoadingCategory(true));
      const response = await axios.get(
        "http://localhost:5000/api/category/getcategory",

        {
          withCredentials: true,
        },
      );

      dispatch(setallcategory(response.data.data));
      // console.log("this from appjsx",response.data.data);

      // setcategory(response.data.data);
    } catch (error) {
      toast.error(error.response?.data.message);
    } finally {
      dispatch(setLoadingCategory(false));
    }
  };

  //   const fetchuserDetails = async () => {
  //   try {
  //     const response = await axios.get(
  //       "http://localhost:5000/api/auth/user/user-detils",
  //       {
  //         withCredentials: true,
  //       }
  //     );

  //     dispatch(userDetails(response.data.data));
  //     // console.log("user ed" ,response.data.data);

  //   } catch (error) {
  //     if (error.response?.status === 401) {
  //     // dispatch(userDetails(initialValue));
  //   }

  //     // console.log("Error:", error.response?.data || error);
  //   }
  // };
  async function getallsubcat() {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/subcategory/getsubcategory",

        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        dispatch(setallsubcategory(response.data.data));
      }

      // dispatch(setallcategory(response.data.data));
    } catch (error) {
      toast.error(error.response?.data.message);
    }
  }

  useEffect(() => {
    fetchuser();
    fetchcategory();
    getallsubcat();
  }, []);

  return (
    <GlobalProvider>
      <Header />
      <main className="min-h-[78vh]">
        <div>
          <Toaster position="top-center" reverseOrder={false} />
        </div>
        <Outlet />
      </main>
      <Footer />
       {
        location.pathname !== '/checkout' && (
          <Cartmobile/>
        )
      }

    </GlobalProvider>
  );
}

export default App;
