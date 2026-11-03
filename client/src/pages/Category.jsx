import React, { useState } from "react";
import Addcategorymodel from "../component/Addcategorymodel";
import toast from "react-hot-toast";
import axios from "axios";
import { useEffect } from "react";
import Nodata from "../component/Nodata";
import Editcategorymodal from "../component/Editcategorymodal";
import Confirmmodel from "../component/Confirmmodel";
import { useDispatch } from "react-redux";
import { setallcategory } from "../store/categorySlice.js";

function Category() {
  const [openaddcatmodel, setopencatmodel] = useState(false);
  const [OpenConfirmBoxDelete, setOpenConfirmBoxDelete] = useState(false);
  const [categorydata, setcategory] = useState([]);
  const dispatch = useDispatch();
  const [EditData, setEditData] = useState({
    name: "",
    image: "",
  });

  const [DeleteCategory, setDeleteCategory] = useState({
    _id: "",
  });
  const [OpenEdit, setOpenEdit] = useState(false);

  const fetchcategory = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/category/getcategory",

        {
          withCredentials: true,
        },
      );
      setcategory(response.data.data);

      dispatch(setallcategory(response.data.data));
    } catch (error) {
      toast.error(error.response?.data.message);
    }
    // finally {
    //   setcatloading(false);
    // }
  };

  const handledeletecategory = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/category/deletecatgory",
        {
          _id: DeleteCategory._id,
        },

        {
          withCredentials: true,
        },
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setOpenConfirmBoxDelete(false);
        fetchcategory();
      }
    } catch (error) {
      toast.error(error.response?.data.message);
      setOpenConfirmBoxDelete(false);
      fetchcategory();
    }
  };

  useEffect(() => {
    fetchcategory();
  }, []);
  // const handleaddcategory = (e) =>{
  //      e.preventDefault()

  // }

  return (
    <section>
      <div className="py-3 px-2 shadow-md flex items-center justify-between  ">
        <h3 className="font-semibold">Category</h3>
        <div className="">
          <button
            onClick={() => setopencatmodel(true)}
            className={` bg-primary-200 hover:bg-primary-100 text-neutral-800  disabled:bg-slate-400
              disabled:cursor-not-allowed rounded-md  font-semibold py-2 px-3 `}
          >
            Add category
          </button>
          {openaddcatmodel && (
            <Addcategorymodel
              fetch={fetchcategory}
              close={() => setopencatmodel(false)}
            />
          )}
        </div>
      </div>

      {categorydata.length == 0 ? (
        <Nodata />
      ) : (
        <div className="p-2 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {categorydata.map((category) => {
            return (
              <div
                key={category._id}
                className="w-full h-60 rounded-md shadow-md bg-white overflow-hidden"
              >
                {/* Image */}
                <div className=" h-[201px] p-2 flex items-center justify-center">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-[14rem] object-scale-down"
                  />
                </div>

                {/* Category Name */}
                {/* <div className="text-center text-md font-semibold truncate px-2">
                  {category.name}
                </div> */}

                {/* Buttons */}
                <div className="flex gap-1 px-1 mt-2">
                  <button
                    onClick={() => {
                      setOpenEdit(true);
                      setEditData(category);
                    }}
                    className="flex-1 bg-green-100 hover:bg-green-200 text-green-600 text-sm font-medium py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      setOpenConfirmBoxDelete(true);
                      setDeleteCategory(category);
                    }}
                    className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 text-sm font-medium py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {OpenEdit && (
        <Editcategorymodal
          close={() => setOpenEdit(false)}
          datacat={EditData}
          fetch={fetchcategory}
        />
      )}

      {OpenConfirmBoxDelete && (
        <Confirmmodel
          close={() => setOpenConfirmBoxDelete(false)}
          confirm={handledeletecategory}
        />
      )}
    </section>
  );
}

export default Category;
