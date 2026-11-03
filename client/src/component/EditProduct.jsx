import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoMdCloseCircle } from "react-icons/io";
import uploadimage from "../utils/uploadimage";
import { useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import Loading from "./Loading";
import { FaCloudUploadAlt } from "react-icons/fa";
import Viewimage from "./Viewimage";
import Select from "react-select";
import Addfield from "./Addfield";

function EditProduct({ close, datapro,fetchProductData }) {
  const [imageLoading, setImageLoading] = useState(false);
  const [ImageURL, setImageURL] = useState("");
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedsubCategory, setselectedsubCategory] = useState([]);
  const [openAddField, setOpenAddField] = useState(false);
  const [uploadproloading, setuploadproloading] = useState(false);
  const [fieldName, setFieldName] = useState("");

  const categorydata = useSelector((state) => state.category.allcategory);
  const subcategorydata = useSelector((state) => state.category.allsubategory);

  const categoryOptions = categorydata.map((item) => ({
    value: item._id,
    label: item.name,
    image: item.image,
  }));

  const subcategoryOptions = subcategorydata.map((item) => ({
    value: item._id,
    label: item.name,
    image: item.image,
  }));

  // Existing category ko Select me selected karna
  useEffect(() => {
    if (!datapro?.category || !categorydata || categorydata.length === 0) {
      return;
    }

    if (
      !datapro?.subCategory ||
      !subcategorydata ||
      subcategorydata.length === 0
    ) {
      return;
    }

    const selected = categorydata
      .filter((cat) =>
        datapro.category.some((selectedCat) => {
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

    const selectedsub = subcategorydata
      .filter((subcat) =>
        datapro.subCategory.some((selectedsubCat) => {
          const subcategoryId =
            typeof selectedsubCat === "object"
              ? selectedsubCat._id
              : selectedsubCat;

          return subcategoryId === subcat._id;
        }),
      )
      .map((subcat) => ({
        value: subcat._id,
        label: subcat.name,
        image: subcat.image,
      }));

    setSelectedCategory(selected);
    setselectedsubCategory(selectedsub);
  }, [datapro, categorydata, subcategorydata]);

  const [data, setdata] = useState({
    _id: datapro._id,
    name: datapro.name,
    image: datapro.image,
    category: [],
    subCategory: [],
    unit: datapro.unit,
    stock: datapro.stock,
    price: datapro.price,
    discount: datapro.discount,
    description: datapro.description,
    more_details: datapro.more_details || {},
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setdata((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleuploadproductimage = async (e) => {
    const file = e.target.files[0];
    setImageLoading(true);
    const imageupload = await uploadimage(file);
    // console.log(imageupload);
    const imageUrl = imageupload.data.data.url;

    setdata((prev) => ({
      ...prev,
      image: Array.isArray(prev.image) ? [...prev.image, imageUrl] : [imageUrl],
    }));

    setImageLoading(false);
  };

  const deleteImage = (index) => {
    setdata((prev) => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index),
    }));
  };

  const handleAddField = () => {
    setdata((preve) => {
      return {
        ...preve,
        more_details: {
          ...preve.more_details,
          [fieldName]: "",
        },
      };
    });
    setFieldName("");
    setOpenAddField(false);
  };

  const handleuploadproduct = async (e) => {
    e.preventDefault();
    console.log("upload pro", data);
    const categories = selectedCategory.map((item) => item.value);
    const Subcategories = selectedsubCategory.map((item) => item.value);
    try {
      setuploadproloading(true);
      const response = await axios.post(
        "http://localhost:5000/api/products/update-product-details",
        {
          _id: data._id,
          name: data.name,
          image: data.image,
          category: categories,
          subCategory: Subcategories,
          unit: data.unit,
          stock: data.stock,
          price: data.price,
          discount: data.discount,
          description: data.description,
          more_details: data.more_details || {},
        },

        {
          withCredentials: true,
        },
      );
      if (response.data.success) {
        toast.success(response.data.message);
        (setSelectedCategory([]), setselectedsubCategory([]));
        setdata({
          name: "",
          image: [],
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          more_details: {},
        });
        if(close){
          close()
        }
        fetchProductData()
      }
    } catch (error) {
      toast.error(error.response?.data.message);
    } finally {
      setuploadproloading(false);
    }
  };

  return (
    <section className="fixed top-0 right-0 left-0 bottom-0 bg-black z-50 bg-opacity-70 p-4">
      <div className="bg-white w-full p-4 max-w-2xl mx-auto rounded overflow-y-auto h-full max-h-[95vh]">
        <section className="">
          <div className="p-2   bg-white shadow-md flex items-center justify-between">
            <h2 className="font-semibold">Upload Product</h2>
            <button onClick={close}>
              <IoMdCloseCircle size={20} />
            </button>
          </div>
          {/*  here start upload product  */}

          <form>
            <div className="flex flex-col py-3 ">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                className="p-2 bg-blue-50 border rounded outline-none focus:border-primary-200"
                id="name"
                name="name"
                placeholder="Enter product name"
                value={data.name}
                onChange={handleChange}
              ></input>
              {/* {errors.email && (
                        <p className="text-red-500 text-[16px] lg:text-[18px] px-3">
                          {errors.email}
                        </p>
                      )} */}
            </div>

            <div className="flex flex-col py-3 ">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                type="text"
                placeholder="Enter product description"
                name="description"
                value={data.description}
                onChange={handleChange}
                required
                multiple
                rows={3}
                className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded resize-none"
              />
            </div>
            <div className="w-full h-full">
              <p>Images</p>
              {/**display uploded image*/}
              <div className="flex flex-wrap gap-4 mb-3">
                {data.image.map((img, index) => {
                  return (
                    <div
                      key={img + index}
                      className="h-20 mt-1 w-20 min-w-20 bg-blue-50 border relative group"
                    >
                      <img
                        src={img}
                        alt={img}
                        className="w-full h-full object-scale-down cursor-pointer"
                        onClick={() => setImageURL(img)}
                      />
                      <div
                        onClick={() => deleteImage(index)}
                        className="absolute bottom-0 right-0 p-1 bg-red-600 hover:bg-red-600 rounded text-white hidden group-hover:block cursor-pointer"
                      >
                        <MdDelete />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div>
                <label
                  htmlFor="productImage"
                  className="bg-blue-50 h-24 border rounded flex justify-center items-center cursor-pointer"
                >
                  <div className="text-center flex justify-center items-center flex-col">
                    {imageLoading ? (
                      <Loading />
                    ) : (
                      <>
                        <FaCloudUploadAlt size={35} />
                        <p>Upload Image</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    id="productImage"
                    className="hidden"
                    accept="image/*"
                    onChange={handleuploadproductimage}
                  />
                </label>
              </div>
            </div>

            {/* ye category select 2 wala */}

            <div className="w-full py-3">
              <label className="block mb-2 font-medium">Select Category</label>

              <Select
                isMulti
                options={categoryOptions}
                value={selectedCategory}
                onChange={setSelectedCategory}
                placeholder="Select category..."
              />
            </div>

            {/* ye wala sub category k liya h  */}

            <div className="w-full py-3">
              <label className="block mb-2 font-medium">
                Select SubCategory
              </label>

              <Select
                isMulti
                options={subcategoryOptions}
                value={selectedsubCategory}
                onChange={setselectedsubCategory}
                placeholder="Select Subcategory..."
              />
            </div>
            <div className="flex flex-col py-3 ">
              <label htmlFor="unit">Unit:</label>
              <input
                type="text"
                className="p-2 bg-blue-50 border rounded outline-none focus:border-primary-200"
                id="unit"
                name="unit"
                placeholder="Enter Unit"
                value={data.unit}
                onChange={handleChange}
              ></input>
            </div>

            <div className="flex flex-col py-3 ">
              <label htmlFor="stock">Number of Stock:</label>
              <input
                type="text"
                className="p-2 bg-blue-50 border rounded outline-none focus:border-primary-200"
                id="stock"
                name="stock"
                placeholder="Enter stock"
                value={data.stock}
                onChange={handleChange}
              ></input>
            </div>

            <div className="flex flex-col py-3 ">
              <label htmlFor="price">Price:</label>
              <input
                type="number"
                className="p-2 bg-blue-50 border rounded outline-none focus:border-primary-200"
                id="price"
                name="price"
                placeholder="Enter price in Numerical"
                value={data.price}
                onChange={handleChange}
              ></input>
            </div>

            <div className="flex flex-col py-3 ">
              <label htmlFor="discount">Discount:</label>
              <input
                type="number"
                className="p-2 bg-blue-50 border rounded outline-none focus:border-primary-200"
                id="discount"
                name="discount"
                placeholder="Enter discount in Numerical"
                value={data.discount}
                onChange={handleChange}
              ></input>
            </div>

            {/**add more field**/}
            {Object?.keys(data?.more_details)?.map((k, index) => {
              return (
                <div className="flex flex-col py-3">
                  <label htmlFor={k} className="font-medium">
                    {k}
                  </label>
                  <input
                    id={k}
                    type="text"
                    value={data?.more_details[k]}
                    onChange={(e) => {
                      const value = e.target.value;
                      setdata((preve) => {
                        return {
                          ...preve,
                          more_details: {
                            ...preve.more_details,
                            [k]: value,
                          },
                        };
                      });
                    }}
                    required
                    className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
                  />
                </div>
              );
            })}

            <div
              onClick={() => setOpenAddField(true)}
              className=" hover:bg-primary-200 bg-white py-1 px-3 w-32 text-center font-semibold border border-primary-200 hover:text-neutral-900 cursor-pointer rounded"
            >
              Add Fields
            </div>

            <div className="mt-3 mb-3 w-full">
              <button
                onClick={handleuploadproduct}
                className={`bg-primary-200 w-full text-neutral-800  disabled:bg-slate-400
                         rounded-md  font-semibold py-2 px-3
                         ${
                           !data.name || !data.image
                             ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                             : "hover:bg-primary-100 cursor-pointer"
                         }`}
              >
                {uploadproloading ? "Loading..." : "Update Product"}
              </button>
            </div>
          </form>

          {ImageURL && (
            <Viewimage url={ImageURL} close={() => setImageURL("")} />
          )}
          {/* end here */}

          {openAddField && (
                  <Addfield
                    value={fieldName}
                    onChange={(e) => setFieldName(e.target.value)}
                    submit={handleAddField}
                    close={() => setOpenAddField(false)}
                  />
                )}
        </section>
      </div>
    </section>
  );
}

export default EditProduct;
