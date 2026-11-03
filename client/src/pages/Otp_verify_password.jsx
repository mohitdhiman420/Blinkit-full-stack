import React, { useEffect, useState } from "react";
import { useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Otp_verify_password() {
  const location = useLocation();
  const OTP_LENGTH = 6;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const email = location?.state?.email;

  // ye ager hm url par direct search karta h to wapis hme forgot par le jayega
  useEffect(() => {
    if (!location?.state?.email) {
      navigate("/forgot-password");
    }
  }, []);

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (value, index) => {
    // Only allow numbers
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pastedOtp = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pastedOtp) return;

    const newOtp = Array(OTP_LENGTH).fill("");

    pastedOtp.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);

    const nextIndex = Math.min(pastedOtp.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async () => {
    const otpValue = otp.join("");

    if (otpValue.length !== OTP_LENGTH) {
      alert("Please enter 6 digit OTP");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/user/verify-forgot-password",
        {
          email,
          otp: otpValue,
        },
        {
          withCredentials: true,
        },
      );

      // console.log(response.data);

      toast.success("Otp verify success");

      // setTimeout(() => {
      //   toast.success(<p className="text-green-800"><span className="font-bold text-primary-100">Wait... </span>You are Redirect To create New Password</p>);
      // }, 1000);
      toast.success(
        <p className="text-green-800">
          <span className="font-bold text-primary-100">Wait... </span>You are
          Redirect To create New Password
        </p>,
      );

      setTimeout(() => {
        navigate("/reset-password", {
          state: {
            email: email,
          },
        });
      }, 3000);

      // API response ke baad
    } catch (error) {
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
          <div className="mt-8 flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="h-12 w-11 rounded-lg border border-gray-300 text-center text-xl font-semibold outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:h-14 sm:w-12"
              />
            ))}
          </div>

          <div className="flex py-3 mx-auto w-full max-w-screen-sm">
            <button
              onClick={handleVerify}
              disabled={loading}
              className={` bg-green-800 hover:bg-green-700  disabled:bg-slate-400
              disabled:cursor-not-allowed rounded-md text-xl font-semibold py-2 w-full text-white`}
            >
              Verify OTP
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

export default Otp_verify_password;
