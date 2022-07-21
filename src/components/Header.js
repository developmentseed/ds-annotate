import React from 'react';

import DevSeedLogo from './../media/layout/ds-logo-pos.svg';
// https://github.com/tailwindtoolbox/Admin-Template/blob/master/index.html
export const Header = ({ openSidebar, setOpenSidebar }) => {
  return (
    <div className="inline-flex">
      <img
        src={DevSeedLogo}
        className="text-4xl cursor-pointer block float-left mr-2 h-9"
        // onClick={() => setOpenSidebar(!openSidebar)}
        onClick={() => setOpenSidebar(true)}

      />
      <h1
        className={`origin-left font-medium text-1xl duration-300 ${
          !openSidebar && 'scale-0'
        }`}
      >
        DS-Annotate
      </h1>
    </div>
  );
};


        // {/* <div
        //   className={`flex items-center rounded-md bg-slate-50 mt-6 ${
        //     !openSidebar ? 'px-2.5' : 'px-4'
        //   } py-2`}
        // >
        //   <HiSearch
        //     className={`text-lg block float-left cursor-pointer ${
        //       openSidebar && 'mr-2'
        //     }`}
        //   ></HiSearch>
        //   <input
        //     type={'search'}
        //     placeholder="serach"
        //     className={`text-base bg-transparent w-full text-white focus:outline-none ${
        //       !openSidebar && 'hidden'
        //     }`}
        //   ></input>
        // </div> */}