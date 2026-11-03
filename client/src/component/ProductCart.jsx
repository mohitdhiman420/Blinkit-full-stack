import React, { useState } from "react";
import EditProduct from "./EditProduct";
import EditAvatar from "../component/EditAvatar";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import axios from "axios";

function ProductCart({ data, fetchProductData }) {
  const [editOpen, setEditOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [loading, setloading] = useState(false);

  const handleDeleteCancel = () => {
    setOpenDelete(false);
  };

  const handleDelete = async () => {
    try {
      setloading(true);
      const response = await axios.post(
        "http://localhost:5000/api/products/delete-product",
        {
          _id: data._id,
        },

        {
          withCredentials: true,
        },
      );
      if (response.data.success) {
        toast.success(response.data.message);
        fetchProductData()
        setOpenDelete(false)
      }
    } catch (error) {
      toast.error(error.response?.data.message);
    } finally {
      setloading(false);
    }
  };

  return (
    <div
      key={data._id}
      className="w-full h-[230px] rounded-md shadow-md bg-white overflow-hidden"
    >
      {/* Image */}
      <div className="w-full h-36 p-2 flex items-center justify-center">
        <img
          src={data?.image[0]}
          alt={data?.name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Category Name */}
      <div className="text-center text-md font-semibold truncate px-2">
        {data?.name}
      </div>
      <div className="text-center text-md font-semibold truncate px-2">
        {data?.unit}
      </div>

      {/* Buttons */}
      <div className="flex gap-1 px-1 mt-2">
        <button
          onClick={() => {
            setEditOpen(true);
            // setEditData(category);
          }}
          className="flex-1 bg-green-100 hover:bg-green-200 text-green-600 text-sm font-medium py-1 rounded"
        >
          Edit
        </button>

        <button
          onClick={() => {
            setOpenDelete(true);
            //   setDeleteCategory(category);
          }}
          className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 text-sm font-medium py-1 rounded"
        >
          Delete
        </button>
      </div>
      {editOpen && (
        <EditProduct
          fetchProductData={fetchProductData}
          datapro={data}
          close={() => setEditOpen(false)}
        />
      )}

      {openDelete && (
        <section className="fixed top-0 left-0 right-0 bottom-0 bg-neutral-600 z-50 bg-opacity-70 p-4 flex justify-center items-center ">
          <div className="bg-white p-4 w-full max-w-md rounded-md">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-semibold">Permanent Delete</h3>
              <button onClick={() => setOpenDelete(false)}>
                <IoClose size={25} />
              </button>
            </div>
            <p className="my-2">Are you sure want to delete permanent ?</p>
            <div className="flex justify-end gap-5 py-4">
              <button
                onClick={handleDeleteCancel}
                className="border px-3 py-1 rounded bg-red-100 border-red-500 text-red-500 hover:bg-red-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="border px-3 py-1 rounded bg-green-100 border-green-500 text-green-500 hover:bg-green-200"
              >
                Delete
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductCart;
