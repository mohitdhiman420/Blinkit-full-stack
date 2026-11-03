import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { IoSearchOutline } from "react-icons/io5";
import Loading from "../component/Loading";
import ProductCart from "../component/ProductCart";

function Products() {
  const [products, setproduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPageCount, settotalPageCount] = useState("");
  const [Search, setSearch] = useState("");
  const [page, setpage] = useState(1);

  const fetchproducts = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/products/getproduct",
        {
          page: page,
          limit: 12,
          search: Search,
        },

        {
          withCredentials: true,
        },
      );
      if (response.data.success) {
        // toast.success(response.data.message);
        setproduct(response.data.data);
        settotalPageCount(response.data.totalNoPage);
      }
    } catch (error) {
      toast.error(error.response?.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchproducts();
  }, [page]);

  const handleOnChange = (e) => {
    const { value } = e.target;
    setSearch(value);
    setpage(1);
  };

  const handleNext = () => {
    if (page !== totalPageCount) {
      setpage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (page > 1) setpage((prev) => prev - 1);
  };


    useEffect(()=>{
    let flag = true 

    const interval = setTimeout(() => {
      if(flag){
        fetchproducts()
        flag = false
      }
    }, 300);

    return ()=>{
      clearTimeout(interval)
    }
  },[Search])

  return (
    <section className="">
      <div className="p-2  bg-white shadow-md flex items-center justify-between gap-4">
        <h2 className="font-semibold">Product</h2>
        <div className="h-full min-w-24 max-w-56 w-full ml-auto bg-blue-50 px-4 flex items-center gap-3 py-2 rounded  border focus-within:border-primary-200">
          <IoSearchOutline size={25} />
          <input
            type="text"
            placeholder="Search product here ..."
            className="h-full w-full  outline-none bg-transparent"
            value={Search}
            onChange={handleOnChange}
          />
        </div>
      </div>

      <div className="p-4 bg-blue-50">
        <div className="min-h-[55vh]">
          <div className="p-2 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {loading && <Loading />}

            {products &&
              products.map((p, index) => {
                return (
                  <ProductCart data={p} fetchProductData={fetchproducts} />
                );
              })}
          </div>
        </div>

        <div className="flex justify-between my-4">
          <button
            onClick={handlePrevious}
            className="border border-primary-200 px-4 py-1 hover:bg-primary-200"
          >
            Previous
          </button>
          <button className="w-full bg-slate-100">
            {page}/{totalPageCount}
          </button>
          <button
            onClick={handleNext}
            className="border border-primary-200 px-4 py-1 hover:bg-primary-200"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}

export default Products;
