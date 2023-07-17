import React, { useContext, useRef, useState } from "react";
import { MainContext } from "../contexts/MainContext";

const EncodeImport = () => {
  const { dispatchEncodeItems } = useContext(MainContext);

  const fileInput = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      const encodeItems = JSON.parse(evt.target.result);
      dispatchEncodeItems({
        type: "CACHING_ENCODED",
        payload: encodeItems,
      });
    };

    reader.onerror = () => {
      console.error("File reading error");
    };

    reader.readAsText(file);
  };

  const handleButtonClick = () => {
    fileInput.current.click();
  };

  return (
    <div>
      <input
        className="hidden"
        type="file"
        accept=".json"
        onChange={handleFileChange}
        ref={fileInput}
      />
      <button
        className="custom_button px-1 inline-flex pr-2"
        onClick={handleButtonClick}
      >
        Import SAM AOIs
      </button>
    </div>
  );
};

export default EncodeImport;
