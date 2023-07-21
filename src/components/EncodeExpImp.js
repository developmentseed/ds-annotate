import React, { useContext, useState } from "react";
import { BsChevronDown } from "react-icons/bs";

import { MainContext } from "../contexts/MainContext";
import { uploadtoS3 } from "./../utils/requests";
import { simplyName, downloadGeojsonFile } from "./../utils/utils";
import EncodeImport from "./EncodeImport";

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
    await uploadtoS3(
      activeEncodeImageItem,
      `encode_images/${simplyName(activeProject.properties.name)}/${
        activeEncodeImageItem.id
      }.json`
    );
    setSpinnerLoading(false);
  };

  const exportToJSON = () => {
    downloadGeojsonFile(
      JSON.stringify(encodeItems),
      `${simplyName(activeProject.properties.name)}_encode.json`
    );
  };

  return (
    <div
      className="relative inline-block text-right"
      onMouseLeave={() => setIsOpen(false)} // Add this line
    >
      {encodeItems.length === 0 ? (
        <EncodeImport />
      ) : (
        <button
          className="custom_button text-center pl-3"
          onClick={toggleDropdown}
        >
          Export AOIs
          <BsChevronDown size="1.5em" className="inline w-6 h-3 text-red" />
        </button>
      )}

      {isOpen && (
        <div className="absolute text-left text-xs right-0 left-0 mt-0 bg-white border border-gray-200 rounded shadow-lg">
          <ul>
            <li
              className="py-2 custom_button border-none px-1"
              onClick={() => {
                exportToS3();
              }}
            >
              Export to S3
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
