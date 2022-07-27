import React from 'react';
import { useContext, useState, useEffect } from 'react';
import { MainContext } from '../contexts/MainContext';
import { BsViewList, BsDownload, BsChevronDown } from 'react-icons/bs';

export const DownloadData = ({ classProps }) => {
  const { activeClass, dispatchSetActiveClass } = useContext(MainContext);

  return (
    <div className="flex flex-row mt-3">
      <button
        type="button"
        className="px-6 pt-2.5 pb-1 bg-blue-600 text-white font-medium text-xs leading-normal uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex mr-1"
      >
        <BsDownload className="w-3 mr-2"></BsDownload>
        JOSM
      </button>
      <button
        type="button"
        className="px-6 pt-2.5 pb-1 bg-blue-600 text-white font-medium text-xs leading-normal uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex "
      >
        <BsDownload className="w-3 mr-2"></BsDownload>
        GeoJson
      </button>
    </div>
  );
};
