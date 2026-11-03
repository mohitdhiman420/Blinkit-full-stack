import React, { useEffect, useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import uploadimage from "../utils/uploadimage";
import { useSelector } from "react-redux";
import Select from "react-select";
import axios from "axios";
import toast from "react-hot-toast";

function Editsubcategory({ close, datasubcat, fetch }) {
  const [loading, setloading] = useState(false);
  const [subcatloading, setsubcatloading] = useState(false);

  // ye category option tak data select2 ka use kiya h isliye h
  const categorydata = useSelector((state) => state.category.allcategory);

  const [selectedCategory, setSelectedCategory] = useState([]);

  const categoryOptions = categorydata.map((item) => ({
    value: item._id,
    label: item.name,
    image: item.image,
  }));

  // Existing category ko Select me selected karna
  useEffect(() => {
    if (!datasubcat?.category || !categorydata || categorydata.length === 0) {
      return;
    }

    const selected = categorydata
      .filter((cat) =>
        datasubcat.category.some((selectedCat) => {
          const categoryId =
            typeof selectedCat === "object" ? selectedCat._id : selectedCat;

          return categoryId === cat._id;
        }),
      )
      .map((cat) => ({
        value: cat._id,
        label: cat.name,
        image: cat.image,
      }));

    setSelectedCategory(selected);
  }, [datasubcat, categorydata]);

  const [data, setdata] = useState({
    _id: datasubcat._id,
    name: datasubcat.name,
    image: datasubcat.image,
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

  const handlesubcategoryimage = async (e) => {
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

  const handleupdatesubcategory = async (e) => {
    e.preventDefault();
    const categories = selectedCategory.map((item) => item.value);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/subcategory/updatesubcategory",
        {
          _id: data._id,
          name: data.name,
          image: data.image,
          category: categories,
        },

        {
          withCredentials: true,
        },
      );
      if (response.data.success) {
        toast.success("update subcategory Successfully!");
        fetch();
        if (close) {
          close();
        }
      }
    } catch (error) {
      toast.error(error.response?.data.message);
    }
  };

  return (
    <section className="fixed top-0 bottom-0 left-0 right-0  bg-neutral-800 bg-opacity-60 flex items-center justify-center">
      <div className="bg-white border p-4 rounded-lg w-full max-w-xl ">
        <div className="flex items-center justify-between ">
          <h3 className="font-semibold">Update SubCategory</h3>
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
                  onChange={handlesubcategoryimage}
                  type="file"
                  className="hidden"
                  id="uploadimg"
                  disabled={!data.name}
                />
              </div>
            </div>
          </div>
          {/* ye btn sirf category ko select karna ka h  */}

          <div className="w-full ">
            <label className="block mb-2 font-medium">Select Category</label>

            <Select
              isMulti
              options={categoryOptions}
              value={selectedCategory}
              onChange={setSelectedCategory}
              placeholder="Select category..."
            />
          </div>

          <div className="mt-3 mb-3 w-full">
            <button
              onClick={handleupdatesubcategory}
              className={`bg-primary-200 w-full text-neutral-800  disabled:bg-slate-400
                   rounded-md  font-semibold py-2 px-3
                   ${
                     !data.name || !data.image
                       ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                       : "hover:bg-primary-100 cursor-pointer"
                   }`}
            >
              {subcatloading ? "Loading..." : "Update SubCategory"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Editsubcategory;
