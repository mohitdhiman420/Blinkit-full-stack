import React, { useEffect, useRef } from "react";
import { IoIosSearch } from "react-icons/io";
import { TypeAnimation } from "react-type-animation";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import useMobile from "../hooks/useMobile";

function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef(null);
  const isMobile = useMobile();

  
   const handleChange = () => {
    
    let searchvalu = inputRef.current.value;
    const url = `/search?q=${searchvalu}`
    navigate(url)
  };

  const RedirectToSearch = () => {
    navigate("/search");
  };

  useEffect(() => {
    if (location.pathname === "/search") {
      inputRef.current?.focus();
    }
  }, [location.pathname]);
  return (
    <>
      <div className="w-full  min-w-[240px] lg:min-w-[420px] h-11 lg:h-12 rounded-lg border flex group focus-within:border-primary-100  items-center px-2  overflow-hidden  text-neutral-700 bg-slate-50">
        <div className="flex items-center">
          {isMobile && location.pathname === "/search" ? (
            <Link
              to={"/"}
              className=" group-focus-within:text-primary-100 text-primary-100"
            >
              <FaArrowLeft size={22} />
            </Link>
          ) : (
            <button className=" group-focus-within:text-primary-100">
              <IoIosSearch size={22} />
            </button>
          )}
        </div>
        <div className="w-full">
          {location.pathname !== "/search" ? (
            <div className="px-2" onClick={RedirectToSearch}>
              <TypeAnimation
                sequence={[
                  //Same substring at the start will only be typed out once, initially
                  'Search "milk"',
                  1000, // wait 1s before replacing "Mice" with "Hamsters"
                  'Search "bread"',
                  1000,
                  'Search "sugar"',
                  1000,
                  'Search "panner"',
                  1000,
                  'Search "chocolate"',
                  1000,
                  'Search "curd"',
                  1000,
                  'Search "rice"',
                  1000,
                  'Search "egg"',
                  1000,
                  'Search "chips"',
                ]}
                wrapper="span"
                speed={40}
                repeat={Infinity}
              />
            </div>
          ) : (
            <div className="w-full ">
              <input
                className="flex bg-transparent bg-slate-50 px-2 outline-none w-full"
                type="text"
                ref={inputRef}
                name="searchinput"
                 onChange={handleChange}
                placeholder="search aata milk and panner more.."
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Search;
