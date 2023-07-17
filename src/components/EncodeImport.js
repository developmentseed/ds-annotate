import React, { useContext, useRef } from "react";
import { NotificationManager } from "react-notifications";

import { MainContext } from "../contexts/MainContext";
import { storeEncodeItems } from "../store/indexedDB";

const EncodeImport = () => {
  const { dispatchEncodeItems } = useContext(MainContext);

  const fileInput = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      const encodeItems = JSON.parse(evt.target.result);
      if (
        encodeItems.length > 0 &&
        encodeItems[0].id &&
        encodeItems[0].image_shape
      ) {
        dispatchEncodeItems({
          type: "CACHING_ENCODED",
          payload: encodeItems,
        });
        //Save data in indexDB
        encodeItems.forEach((e) => storeEncodeItems.addData({ ...e }));
      } else {
        NotificationManager.error(
          "The imported file does not contain the required format.",
          `File format error`,
          10000
        );
      }
    };

    reader.onerror = () => {
      NotificationManager.error(`File reading error`, 10000);
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
