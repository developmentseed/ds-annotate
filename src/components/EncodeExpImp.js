import React, { useContext, useState } from "react";
import { MainContext } from "../contexts/MainContext";
import { uploadtoS3, downloadGeojsonFile, simplyName } from "./../utils/utils";

export const EncodeExpImp = () => {
  const {
    encodeItems,
    activeProject,
    setSpinnerLoading,
    activeEncodeImageItem,
  } = useContext(MainContext);

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const exportToS3 = async () => {
    setSpinnerLoading(true);

    const resp = await uploadtoS3(
      activeEncodeImageItem,
      `encode_images/${simplyName(activeProject.properties.name)}_${
        activeEncodeImageItem.id
      }.json`
    );
    console.log("%cEncodeExpImp.js line:22 resp", "color: #007acc;", resp);
    setSpinnerLoading(false);
  };

  const exportToJSON = () => {
    downloadGeojsonFile(
      JSON.stringify(encodeItems),
      `${simplyName(activeProject.properties.name)}_encode.json`
    );
  };

  return (
    <div className="relative inline-block">
      <button
        className="custom_button px-1 inline-flex"
        onClick={toggleDropdown}
      >
        Export Images
        <svg
          className="w-4 h-4 ml-2 -mr-1 text-red"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute text-xs right-0  left-0 mt-0 bg-white border border-gray-200 rounded shadow-lg">
          <ul>
            <li
              className="py-2 custom_button border-none px-1"
              onClick={() => {
                exportToS3();
              }}
            >
              Export to s3
            </li>
            <li
              className="py-2 custom_button border-none px-1"
              onClick={() => {
                exportToJSON();
              }}
            >
              Export as JSON
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
