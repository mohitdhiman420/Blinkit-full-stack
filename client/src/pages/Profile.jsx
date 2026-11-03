import React, { useState, useEffect } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import EditAvatar from "../component/EditAvatar";
import axios from "axios";
import toast from "react-hot-toast";
import { userDetails } from "../store/userSlice";
import fetchuserDetails from "../utils/fetchuser";

function Profile() {
  const [errors, setErrors] = useState({});
  const user = useSelector((state) => state.user);
  const [showavtaredit, setshowavtaredit] = useState(false);
  const [loading, setloading] = useState(false);

  const dispatch = useDispatch();

  const [userdata, setuserdata] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
  });

  useEffect(() => {
    setuserdata({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setuserdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // console.log("user details", user);

  const handleupdateuserDetails = async (e) => {
    e.preventDefault();
    const name = userdata.name;
    const email = userdata.email;
    const mobile = userdata.mobile;

    let newerror = {};
    if (!name || name == "undefine" || name == null) {
      newerror.name = "Name is required";
    }
    if (!email || email == "undefine" || email == null) {
      newerror.email = "Email is required";
    }

    setErrors(newerror);

    if (Object.keys(newerror).length > 0) {
      return;
    }

    try {
      setloading(true);
      const response = await axios.post(
        "http://localhost:5000/api/auth/user/updateuser",
        {
          name,
          email,
          mobile,
        },
        {
          withCredentials: true,
        },
      );
     

      if (response.data.success) {
        toast.success("User Update Successfully!");
        const userData = await fetchuserDetails();
        // console.log("user new details are ", userData);
        dispatch(userDetails(userData));
      }
    } catch (error) {
      //  ye toast h yani error message dikhane k liye
      console.log(error);

      toast.error(error.response?.data.message);
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="w-20 h-20 flex items-center justify-center rounded-full drop-shadow-sm">
        {user.avatar ? (
          <img
            src={user?.avatar}
            alt={user.name}
            className=" h-20 overflow-hidden w-20 rounded-full drop-shadow-sm"
          />
        ) : (
          <FaRegUserCircle size={60} />
        )}
      </div>
      <button
        onClick={() => setshowavtaredit(true)}
        className="text-sm border w-20 text-center rounded-md px-3 py-1 font-semibold mt-2 border-primary-100 outline-none hover:bg-primary-100"
      >
        Edit
      </button>

      {showavtaredit && <EditAvatar close={() => setshowavtaredit(false)} />}

      <form className="container mx-auto px-5">
        <div className="flex flex-col py-3 ">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            className="p-2 bg-blue-50 border rounded outline-none focus:border-primary-200"
            id="name"
            value={userdata.name}
            onChange={handleChange}
          ></input>
          {errors.name && (
            <p className="text-red-500 text-[16px] lg:text-[18px] px-3">
              {errors.name}
            </p>
          )}
        </div>
        <div className="flex flex-col py-3 ">
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            name="email"
            className="p-2 bg-blue-50 border rounded outline-none focus:border-primary-200"
            id="email"
            value={userdata.email}
            onChange={handleChange}
          ></input>
          {errors.email && (
            <p className="text-red-500 text-[16px] lg:text-[18px] px-3">
              {errors.email}
            </p>
          )}
        </div>
        {/* <div className="flex flex-col py-3 ">
          <label htmlFor="pass">Password:</label>
          <input
            type="text"
            name="password"
            className="p-2 bg-blue-50 border rounded outline-none focus:border-primary-200"
            id="pass"
            value={userdata.password}
            onChange={handleChange}
          ></input>
        </div> */}
        <div className="flex flex-col py-3 ">
          <label htmlFor="mob">Mobile:</label>
          <input
            type="text"
            name="mobile"
            className="p-2 bg-blue-50 border rounded outline-none focus:border-primary-200"
            id="mob"
            value={userdata.mobile}
            onChange={handleChange}
          ></input>
        </div>
        <div className="flex py-3 mx-auto w-full max-w-screen-lg">
          <button
            onClick={handleupdateuserDetails}
            className={`bg-green-800 hover:bg-green-700 disabled:bg-slate-400
              disabled:cursor-not-allowed rounded-md text-xl font-semibold py-2 w-full text-white`}
          >
            {loading ? "Loading" : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Profile;
