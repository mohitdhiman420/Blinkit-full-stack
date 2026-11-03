import React, { useState } from "react";
import { useRef } from "react";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userDetails } from "../store/userSlice";

function Login() {
  const [showpass, setshowpass] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const emailRef = useRef();
  const passwordRef = useRef();

  // this for Login user

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    let newerror = {};

    if (!email || email == "undefine" || email == null) {
      newerror.email = "Email is required";
    }
    if (!password || password == "undefine" || password == null) {
      newerror.password = "Password is required";
    }

    if (Object.keys(newerror).length > 0) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/user/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        },
      );
      // console.log(response);

      if (response.data.success) {
        toast.success("User Login Successfully!");
        localStorage.setItem("accesstoken", response.data.data.accessToken);
        localStorage.setItem("refreshtoken", response.data.data.refreshToken);
      }
      // console.log(response.data);
      // Login ke baad user details fetch karo
      const userResponse = await axios.get(
        "http://localhost:5000/api/auth/user/user-detils",
        {
          withCredentials: true,
        },
      );

      dispatch(userDetails(userResponse.data.data));
      // console.log("user ed" ,response.data.data);

      navigate("/");
    } catch (error) {
      //  ye toast h yani error message dikhane k liye

      toast.error(error.response?.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className=" w-full container mx-auto">
      {/* ye message show karna k liye h */}
      <div>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
      <div className="bg-white max-w-screen-sm mx-auto my-4 py-4 px-2 text-xl rounded-md">
        <p className="font-semibold text-center text-2xl">
          Welcome To Binkeyit Login
        </p>

        <form>
          <div className="flex flex-col py-3 ">
            <label for="email">Email:</label>
            <input
              type="text"
              ref={emailRef}
              className="p-2 bg-blue-50 border rounded outline-none focus:border-primary-200"
              id="email"
              autoComplete=""
            ></input>
            {errors.email && (
              <p className="text-red-500 text-[16px] lg:text-[18px] px-3">
                {errors.email}
              </p>
            )}
          </div>
          <div className="flex flex-col py-3 relative">
            <label for="password">Password:</label>
            <input
              type={showpass ? "text" : "password"}
              ref={passwordRef}
              className="p-2 bg-blue-50 border rounded outline-none focus:border-primary-200"
              id="password"
            ></input>
            {errors.password && (
              <p className="text-red-500 text-[16px] lg:text-[18px] px-3">
                {errors.password}
              </p>
            )}
            <div
              className={`absolute cursor-pointer right-4 ${errors.password ? " bottom-[3.3rem]" : "bottom-6"} `}
              //     className="absolute right-4 bottom-6 cursor-pointer "
              onClick={() => setshowpass((prev) => !prev)}
            >
              {showpass ? <FaRegEye /> : <FaRegEyeSlash />}
            </div>
          </div>
          <Link
            to={"/forgot-password"}
            className="flex justify-end px-2 py-2 ml-auto hover:text-primary-100"
          >
            Forgot Password ?
          </Link>
          <div className="flex py-3 mx-auto w-full max-w-screen-sm">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={` bg-green-800 hover:bg-green-700  disabled:bg-slate-400
              disabled:cursor-not-allowed rounded-md text-xl font-semibold py-2 w-full text-white`}
            >
              Login
            </button>
          </div>
          <p className="py-3 px-2">
            Don't Have Account ?
            <Link to={"/register"} className="font-semibold text-green-800">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default Login;
