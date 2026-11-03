import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaRegUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { updateavatar } from "../store/userSlice";
import { IoMdCloseCircleOutline } from "react-icons/io";

function EditAvatar({close}) {
  const user = useSelector((state) => state.user);
  const [loadingfile, setloadingfile] = useState(false);
  const dispatch = useDispatch();

  const handleuploadfile = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.success("please select file first");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setloadingfile(true);
      const response = await axios.post(
        "http://localhost:5000/api/auth/user/upload_avtar",
        formData,
        {
          withCredentials: true,
        },
      );

      const newAvatar = response.data.data.avatar.avatar;

      // console.log("NEW AVATAR:", newAvatar);

      dispatch(updateavatar(newAvatar));

      toast.success("Avatar updated successfully");
    } catch (error) {
      toast.error(error.response?.data.message);
    } finally {
      setloadingfile(false);
      close()
    }
  };

  // console.log("USER AFTER REDUX:", user);

  return (
    <section className="fixed top-0 bottom-0 left-0 right-0  bg-neutral-800 bg-opacity-60 flex items-center justify-center">
      <div className=" bg-white border p-4 rounded-lg w-full max-w-sm flex flex-col items-center justify-center">
        <div className="block w-fit ml-auto" onClick={close}><IoMdCloseCircleOutline size = {25}/></div>
        <div className="w-20 h-20 flex items-center justify-center rounded-full drop-shadow-sm">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className=" h-20 overflow-hidden w-20 rounded-full drop-shadow-sm"
            />
          ) : (
            <FaRegUserCircle size={60} />
          )}
        </div>
        <form>
          <label htmlFor="upload">
            <div className="text-sm border w-20 overflow-hidden text-center rounded-md px-3 py-1 font-semibold mt-2 border-primary-100 outline-none hover:bg-primary-100">
              {loadingfile ? "Loading.." : "Upload"}
            </div>
          </label>
          <input
            onChange={handleuploadfile}
            type="file"
            id="upload"
            className="hidden"
           
          />
        </form>
      </div>
    </section>
  );
}

export default EditAvatar;
