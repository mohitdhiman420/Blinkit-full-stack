import React, { useState } from "react";
import { useRef } from "react";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Forgot_password() {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const emailRef = useRef();

  // this for Forgot password user

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const email = emailRef.current.value;

    let newerror = {};

    if (!email || email == "undefine" || email == null) {
      newerror.email = "Email is required";
    }
    setErrors(newerror);
    if (Object.keys(newerror).length > 0) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/user/forgot-password",
        {
          email,
        },
        {
          withCredentials: true,
        },
      );

      // console.log(response.data);
      toast.success("Otp Send To Your Email");
      setTimeout(() => {
        navigate("/verify-password-otp", {
          state: {
            email: email,
          },
        });
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
        <p className="font-semibold text-center text-2xl">Forgot Password</p>

        <form>
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

          <div className="flex py-3 mx-auto w-full max-w-screen-sm">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={` bg-green-800 hover:bg-green-700  disabled:bg-slate-400
              disabled:cursor-not-allowed rounded-md text-xl font-semibold py-2 w-full text-white`}
            >
              Send OTP
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

export default Forgot_password;
