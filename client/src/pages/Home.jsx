import React from "react";
import banner from "../assets/banner.jpg";
import bannerMobile from "../assets/banner-mobile.jpg";
import { useSelector } from "react-redux";
import { Validurlconverter } from "../utils/Validurlconverter";
import { useNavigate } from "react-router-dom";
import CategoryWiseproductdisp from "../component/CategoryWiseproductdisp";

function Home() {
  const loadingCategory = useSelector(
    (state) => state.category.loadingCategory,
  );
  const categoryData = useSelector((state) => state.category.allcategory);
  const SubcategoryData = useSelector((state) => state.category.allsubategory);
  const navigate = useNavigate();

  const handleRedirectProductListpage = (id, cat) => {
    // console.log(id, cat);
    const subcategory = SubcategoryData.find((sub) => {
      const filterData = sub.category.some((c) => {
        return c._id == id;
      });

      return filterData ? true : null;
    });
    const url = `/${Validurlconverter(cat)}-${id}/${Validurlconverter(subcategory.name)}-${subcategory._id}`;
    console.log(url);

    navigate(url)
  };

  return (
    <section className="bg-white">
      <div className="container mx-auto">
        <div
          className={`w-full h-full min-h-48 bg-blue-100 rounded ${!banner && "animate-pulse my-2"} `}
        >
          <img
            src={banner}
            className="w-full h-full hidden lg:block"
            alt="banner"
          />
          <img
            src={bannerMobile}
            className="w-full h-full lg:hidden"
            alt="banner"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 my-2 grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10  gap-2">
        {loadingCategory
          ? new Array(12).fill(null).map((c, index) => {
              return (
                <div
                  key={index + "loadingcategory"}
                  className="bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse"
                >
                  <div className="bg-blue-100 min-h-24 rounded"></div>
                  <div className="bg-blue-100 h-8 rounded"></div>
                </div>
              );
            })
          : categoryData.map((cat, index) => {
              return (
                <div
                  key={cat._id + "displayCategory"}
                  className="w-full h-full"
                  onClick={
                    () => handleRedirectProductListpage(cat._id, cat.name)
                    // handleRedirectProductListpage()
                  }
                >
                  <div>
                    <img
                      src={cat.image}
                      alt={"newtest"+index}
                      className="w-full h-full object-scale-down"
                    />
                  </div>
                </div>
              );
            })}
      </div>

      {/***display category product */}
      {categoryData?.map((c, index) => {
        return (
          <CategoryWiseproductdisp
            key={c?._id + "CategorywiseProduct"}
            id={c?._id}
            name={c?.name}
          />
        );
      })}
    </section>
  );
}

export default Home;
