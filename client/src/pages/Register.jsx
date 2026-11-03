import React, { useState } from "react";
import { useRef } from "react";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Register() {
  const [showpass, setshowpass] = useState(false);
  const [confirmpass, setshowconfirmpass] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  // this for regesteruser

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirmpassword = confirmPasswordRef.current.value;

    let newerror = {};
    if (!name || name == "undefine" || name == null) {
      newerror.name = "Name is required";
    }
    if (!email || email == "undefine" || email == null) {
      newerror.email = "Email is required";
    }
    if (!password || password == "undefine" || password == null) {
      newerror.password = "Password is required";
    }
    if (
      !confirmpassword ||
      confirmpassword == "undefine" ||
      confirmpassword == null
    ) {
      newerror.confirmpassword = "Confirm Password is required";
    }
    if (password !== confirmpassword) {
      newerror.confirmpassword = "Enter Both password Same";
    }
    setErrors(newerror);

    if (Object.keys(newerror).length > 0) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/user/register",
        {
          name,
          email,
          password,
        },{
          withCredentials: true,
        },
      );

      // console.log(response.data);
      toast.success("User Created Successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
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
          Welcome To Binkeyit
        </p>

        <form>
          <div className="flex flex-col py-3 ">
            <label for="name">Name:</label>
            <input
              type="text"
              ref={nameRef}
              className="p-2 bg-blue-50 border rounded outline-none focus:border-primary-200"
              id="name"
              autoFocus
            ></input>
            {errors.name && (
              <p className="text-red-500 text-[16px] lg:text-[18px] px-3">
                {errors.name}
              </p>
            )}
          </div>
          <div className="flex flex-col py-3 ">
            <label for="email">Email:</label>
            <input
              type="text"
              ref={emailRef}
              className="p-2 bg-blue-50 border rounded outline-none focus:border-primary-200"
              id="email"
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
          <div className="flex flex-col py-3 relative">
            <label for="confirmpassword">Confirm password:</label>
            <input
              type={confirmpass ? "text" : "password"}
              ref={confirmPasswordRef}
              className="p-2 bg-blue-50 border rounded outline-none focus:border-primary-200"
              id="confirmpassword"
            ></input>
            {errors.confirmpassword && (
              <p className="text-red-500 text-[16px] lg:text-[18px] px-3">
                {errors.confirmpassword}
              </p>
            )}
            <div
              className={`absolute cursor-pointer right-4 ${errors.password ? " bottom-[3.3rem]" : "bottom-6"} `}
              //     className="absolute right-4 bottom-6 cursor-pointer"
              onClick={() => setshowconfirmpass((prev) => !prev)}
            >
              {confirmpass ? <FaRegEye /> : <FaRegEyeSlash />}
            </div>
          </div>
          <div className="flex py-3 mx-auto w-full max-w-screen-sm">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`bg-green-800 hover:bg-green-700 disabled:bg-slate-400
              disabled:cursor-not-allowed rounded-md text-xl font-semibold py-2 w-full text-white`}
            >
              Register
            </button>
          </div>
          <p className="py-3 px-2">
            Already Have Account ?{" "}
            <Link to={"/login"} className="font-semibold text-green-800">
              Login
            </Link>{" "}
          </p>
        </form>
      </div>

      {/*  */}
    </section>
  );
}

export default Register;
