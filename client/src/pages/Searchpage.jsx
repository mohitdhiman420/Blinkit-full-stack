import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import CardProduct from "../component/CardProduct";
import CardLoading from "../component/CardLoading";
import noDataImage from "../assets/nothing here yet.webp";
import toast from "react-hot-toast";
import axios from "axios";

function Searchpage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const loadingArrayCard = new Array(10).fill(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const params = useLocation();
  const searchText = params?.search?.slice(3);

  const fetchproductbysearch = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/products/search-product",
        {
          search: searchText,
          page: page,
          limit: 10,
        },

        {
          withCredentials: true,
        },
      );
      if (response.data.success) {
        // toast.success(response.data.message);
        if (response.data.page == 1) {
          setData(response.data.data);
        } else {
          setData((preve) => {
            return [...preve, ...response.data.data];
          });
        }
        setTotalPage(response.data.totalPage);
      }
    } catch (error) {
      toast.error(error.response?.data.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setPage(1);
    setData([]);
  }, [searchText]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchproductbysearch();
    }, 700);

    return () => clearTimeout(timer);
  }, [searchText, page]);

  const handleFetchMore = () => {
    if (totalPage > page) {
      setPage((preve) => preve + 1);
    }
  };
  return (
    <section className="bg-white">
      <div className="container mx-auto p-4">
        <p className="font-semibold">Search Results: {data.length} </p>

        <InfiniteScroll
          dataLength={data.length}
          hasMore={page < totalPage && !loading}
          next={handleFetchMore}
          // ye last m ager msg dena h to
          endMessage={
            data.length > 0 && (
              <p className="text-center font-semibold  py-4 text-green-700">
                All products loaded Done !
              </p>
            )
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 py-4 gap-4">
            {data.map((p, index) => {
              return (
                <CardProduct data={p} key={p?._id + "searchProduct" + index} />
              );
            })}

            {/***loading data */}
            {loading &&
              loadingArrayCard.map((_, index) => {
                return <CardLoading key={"loadingsearchpage" + index} />;
              })}
          </div>
        </InfiniteScroll>

        {
          //no data
          !data[0] && !loading && (
            <div className="flex flex-col justify-center items-center w-full mx-auto">
              <img
                src={noDataImage}
                className="w-full h-full max-w-xs max-h-xs block"
              />
              <p className="font-semibold my-2">No Data found</p>
            </div>
          )
        }
      </div>
    </section>
  );
}

export default Searchpage;
