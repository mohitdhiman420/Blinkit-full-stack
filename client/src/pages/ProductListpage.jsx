import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { Validurlconverter } from "../utils/Validurlconverter";
import CardProduct from "../component/CardProduct";
import { useSelector } from "react-redux";
import Loading from "../component/Loading";

function ProductListpage() {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setdata] = useState([]);
  const [page, setPage] = useState(1);
  const [DisplaySubCatory, setDisplaySubCategory] = useState([]);

  const AllSubCategory = useSelector((state) => state.category.allsubategory);
  const subCategory = params?.subcategory?.split("-");
  const subCategoryName = subCategory
    ?.slice(0, subCategory?.length - 1)
    ?.join(" ");

  const categoryId = params.category.split("-").slice(-1)[0];
  const subCategoryId = params.subcategory.split("-").slice(-1)[0];

  const fetchroductlist = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/products/get-product-bycategory-and-subcategory",
        {
          categoryid: categoryId,
          subcategoryid: subCategoryId,
          page: page,
          limit: 8,
        },

        {
          withCredentials: true,
        },
      );
      if (response.data.success) {
        
        if (response.data.page == 1) {
          setdata(response.data.data);
        } else {
          setdata([...data, ...response.data.data]);
        }
      }
    } catch (error) {
      toast.error(error.response?.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchroductlist();
  }, [params]);

  useEffect(() => {
    const sub = AllSubCategory.filter((s) => {
      const filterData = s.category.some((el) => {
        return el._id == categoryId;
      });

      return filterData ? filterData : null;
    });
    setDisplaySubCategory(sub);
  }, [params, AllSubCategory]);

  return (
    <section className="sticky top-24 lg:top-20">
      <div className="container sticky top-24  mx-auto grid grid-cols-[90px,1fr]  md:grid-cols-[200px,1fr] lg:grid-cols-[280px,1fr]">
        {/**sub category **/}
        <div className=" min-h-[84vh] max-h-[84vh] overflow-y-scroll  grid gap-1 shadow-md scrollbarCustom bg-white py-2">
          {DisplaySubCatory.map((s, index) => {
            const link = `/${Validurlconverter(s?.category[0]?.name)}-${s?.category[0]?._id}/${Validurlconverter(s.name)}-${s._id}`;
            return (
              <Link
                to={link}
                className={`w-full p-2 lg:flex items-center lg:w-full lg:h-16 box-border lg:gap-4 border-b 
                  hover:bg-green-100 cursor-pointer
                  ${subCategoryId === s._id ? "bg-green-100" : ""}
                `}
              >
                <div className="w-fit max-w-28 mx-auto lg:mx-0 bg-white rounded  box-border">
                  <img
                    src={s.image}
                    alt="subCategory"
                    className=" w-14 lg:h-14 lg:w-12 h-full object-scale-down"
                  />
                </div>
                <p className="-mt-6 lg:mt-0 text-xs text-center lg:text-left lg:text-base">
                  {s.name}
                </p>
              </Link>
            );
          })}
        </div>

        {/**Product **/}
        <div className="sticky top-20">
          <div className="bg-white shadow-md p-4 z-10">
            <h3 className="font-semibold">{subCategoryName}</h3>
          </div>
          <div>
            <div className="min-h-[80vh] max-h-[80vh] overflow-y-auto relative">
              <div className=" grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 p-4 gap-4 ">
                {data.map((p, index) => {
                  return (
                    <CardProduct
                      data={p}
                      key={p._id + "productSubCategory" + index}
                    />
                  );
                })}
              </div>
            </div>

            {loading && <Loading />}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductListpage;
