import React, { useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import uploadimage from "../utils/uploadimage";
import toast from "react-hot-toast";
import axios from "axios";

// isme jo ye datacat h isme singal cat data aata h
function Editcategorymodal({ close, datacat, fetch }) {
  const [loading, setloading] = useState(false);
  const [catloading, setcatloading] = useState(false);

  const [data, setdata] = useState({
    _id: datacat._id,
    name: datacat.name,
    image: datacat.image,
  });

  const handleOnChangename = (e) => {
    const { name, value } = e.target;

    setdata((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handlecategoryimage = async (e) => {
    const file = e.target.files[0];
    setloading(true);
    const imageupload = await uploadimage(file);

    setdata((prev) => {
      return {
        ...prev,
        image: imageupload.data.data.url,
      };
    });

    setloading(false);
  };

  const handleupdatecategory = async (e) => {
    e.preventDefault();

    try {
      setcatloading(true);
   
      const response = await axios.post(
        "http://localhost:5000/api/category/editcategory",
        {
          _id: data._id, 
          name: data.name,
          image: data.image,
        },

        {
          withCredentials: true,
        },
      );
      if (response.data.success) {
        toast.success(response.data.message);
        close();
        fetch();
      }
    } catch (error) {
      toast.error(error.response?.data.message);
    } finally {
      setcatloading(false);
    }
  };

  return (
    <section className="fixed top-0 bottom-0 left-0 right-0  bg-neutral-800 bg-opacity-60 flex items-center justify-center">
      <div className="bg-white border p-4 rounded-lg w-full max-w-xl ">
        <div className="flex items-center justify-between ">
          <h3 className="font-semibold">Update Category</h3>
          <IoMdCloseCircleOutline onClick={close} size={25} />
        </div>

        <form>
          <div className="flex flex-col py-3 ">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              className="p-2 bg-blue-50 border rounded outline-none focus:border-primary-200"
              id="name"
              name="name"
              value={data.name}
              onChange={handleOnChangename}
            ></input>
            {/* {errors.email && (
               <p className="text-red-500 text-[16px] lg:text-[18px] px-3">
                 {errors.email}
               </p>
             )} */}
          </div>

          <div className="w-full h-full">
            <p>Images</p>
            <div className="flex lg:flex-row flex-col items-center gap-6">
              <div className="flex items-center justify-center w-full lg:w-36  h-36 rounded   bg-blue-50">
                {data.image ? (
                  <img
                    src={data.image}
                    alt={data.image}
                    className="  overflow-hidden lg:w-36  h-36 w-fit drop-shadow-sm"
                  />
                ) : (
                  <p>No Image</p>
                )}
              </div>

              {/* ye upload image btn  h  */}
              <div className="w-full">
                <label htmlFor="uploadimg">
                  <div
                    className={`text-md border w-full lg:w-36 text-center rounded-md px-3 py-2 font-semibold mt-2
                          border-primary-100 outline-none
                             ${
                               !data.name
                                 ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                 : "hover:bg-primary-100 cursor-pointer"
                             }`}
                  >
                    {loading ? "Loading..." : "Upload Image"}
                  </div>
                </label>

                <input
                  onChange={handlecategoryimage}
                  type="file"
                  className="hidden"
                  id="uploadimg"
                  disabled={!data.name}
                />
              </div>
            </div>
          </div>

          <div className="mt-3 mb-3 w-full">
            <button
              onClick={handleupdatecategory}
              className={`bg-primary-200 w-full text-neutral-800  disabled:bg-slate-400
                rounded-md  font-semibold py-2 px-3
                ${
                  !data.name || !data.image
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "hover:bg-primary-100 cursor-pointer"
                }`}
            >
              {catloading ? "Loading..." : "update"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Editcategorymodal;
