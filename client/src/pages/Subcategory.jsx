import React, { useEffect, useState } from "react";
import Addsubcategorymodel from "../component/Addsubcategorymodel";
import axios from "axios";
import toast from "react-hot-toast";
import { createColumnHelper } from "@tanstack/react-table";
import { LuPencil } from "react-icons/lu";
import { MdDelete } from "react-icons/md";
import { HiPencil } from "react-icons/hi";
import Displaytable from "../component/Displaytable";
import Viewimage from "../component/Viewimage";
import Editsubcategory from "../component/Editsubcategory";
import Confirmmodel from "../component/Confirmmodel";
import { useSelector } from "react-redux";

function Subcategory() {
  const [opensubcatmodel, setopensubcatmodel] = useState(false);
  const [Subcategory, setsubcategory] = useState([]);
  const columnHelper = createColumnHelper();
  const [ImageURL, setImageURL] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [deleteSubCategory, setDeleteSubCategory] = useState({
    _id: "",
  });
  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false);
  const [editData, setEditData] = useState({
    _id: "",
  });

  // const subcate = useSelector(state => state.category)
  // console.log(subcate);
  


  async function getallsubcat() {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/subcategory/getsubcategory",

        {
          withCredentials: true,
        },
      );

      setsubcategory(response.data.data);

      // dispatch(setallcategory(response.data.data));
    } catch (error) {
      toast.error(error.response?.data.message);
    }
  }

  useEffect(() => {
    getallsubcat();
  }, []);


   const handledeletesubcategory = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/subcategory/deletesubcategory",
          {
            _id: deleteSubCategory._id,
          },
  
          {
            withCredentials: true,
          },
        );
        if (response.data.success) {
          toast.success(response.data.message);
          setOpenDeleteConfirmBox(false);
          getallsubcat();
        }
      } catch (error) {
        toast.error(error.response?.data.message);
        setOpenDeleteConfirmBox(false);
        getallsubcat();
      }
    };

  const column = [
    columnHelper.accessor("name", {
      header: "Name",
    }),
    columnHelper.accessor("image", {
      header: "Image",
      cell: ({ row }) => {
        // console.log("row");
        return (
          <div className="flex justify-center items-center">
            <img
              src={row.original.image}
              alt={row.original.name}
              className="w-8 h-8 cursor-pointer"
              onClick={() => {
                setImageURL(row.original.image);
              }}
            />
          </div>
        );
      },
    }),
    columnHelper.accessor("category", {
      header: "Category",
      cell: ({ row }) => {
        return (
          <>
            {row.original.category.map((c, index) => {
              return (
                <p
                  key={c._id + "table"}
                  className="shadow-md px-1 inline-block"
                >
                  {c.name}
                </p>
              );
            })}
          </>
        );
      },
    }),
    columnHelper.accessor("_id", {
      header: "Action",
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setOpenEdit(true);
                setEditData(row.original);
              }}
              className="p-2 bg-green-100 rounded-full hover:text-green-600"
            >
              <HiPencil size={20} />
            </button>
            <button
              onClick={() => {
                setOpenDeleteConfirmBox(true);
                setDeleteSubCategory(row.original);
              }}
              className="p-2 bg-red-100 rounded-full text-red-500 hover:text-red-600"
            >
              <MdDelete size={20} />
            </button>
          </div>
        );
      },
    }),
  ];

  return (
    <section>
      <div className="py-3 px-2 shadow-md flex items-center justify-between  ">
        <h3 className="font-semibold">SubCategory</h3>
        <div className="">
          <button
            onClick={() => setopensubcatmodel(true)}
            className={` bg-primary-200 hover:bg-primary-100 text-neutral-800  disabled:bg-slate-400
              disabled:cursor-not-allowed rounded-md  font-semibold py-2 px-3 `}
          >
            Add Subcategory
          </button>
          {opensubcatmodel && (
            <Addsubcategorymodel
              fetch={getallsubcat}
              close={() => setopensubcatmodel(false)}
            />
          )}
        </div>
      </div>
      {/*  ye table data k liya h  */}
      <Displaytable data={Subcategory} column={column} />

      {/* this for view image in sub category  */}
      {ImageURL && <Viewimage url={ImageURL} close={() => setImageURL("")} />}

      {/* ye edit sub cat k liye h  */}

      {openEdit && (
        <Editsubcategory
          close={() => setOpenEdit(false)}
          datasubcat={editData}
          fetch={getallsubcat}
        />
      )}

      {openDeleteConfirmBox && (
        <Confirmmodel
          close={() => setOpenDeleteConfirmBox(false)}
          confirm={handledeletesubcategory}
        />
      )}
    </section>
  );
}

export default Subcategory;
