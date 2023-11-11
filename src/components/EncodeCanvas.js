import React, { useContext, useState, useEffect } from "react";
import { NotificationManager } from "react-notifications";
import { MainContext } from "../contexts/MainContext";
import { getCanvasForLayer } from "../utils/canvas";
import { getEncode, getDecode, getPropertiesRequest } from "../utils/requests";
import { storeEncodeItems, storeItems } from "../store/indexedDB";
import { guid } from "../utils/utils";

export const EncodeCanvas = ({ requestMultipoint, setRequestMultipoint }) => {
  const {
    map,
    pointsSelector,
    dispatchSetPointsSelector,
    activeProject,
    activeClass,
    dispatchSetItems,
    items,
    encodeItems,
    dispatchEncodeItems,
    activeEncodeImageItem,
    dispatchActiveEncodeImageItem,
    setSpinnerLoading,
    decoderType,
    dispatchDecoderType,
  } = useContext(MainContext);

  const [samApiStatus, setSamApiStatus] = useState(null);
  // const [notificationShown, setNotificationShown] = useState(false);

  const reset = () => {
    setSpinnerLoading(false);
    setSamApiStatus(null);
  };

  // Request segment-anything-services
  const encodeImage = async () => {
    const requestProps = getPropertiesRequest(map, pointsSelector);

    setSpinnerLoading(true);
    let newEncodeItems = encodeItems;

    //=================== Encode ===================
    try {
      const canvas = await getCanvasForLayer(map, "main_layer");
      const base64 = canvas.split(";base64,")[1];
      const encodeRespJson = await getEncode(base64);
      requestProps.image_embeddings = encodeRespJson.image_embedding;

      const encodeItem = Object.assign({}, requestProps, {
        canvas,
        id: guid(),
        project: activeProject.properties.name,
      });

      //Merge existing encode items and new
      newEncodeItems = [...encodeItems, encodeItem];

      // Set reduce items
      dispatchEncodeItems({
        type: "CACHING_ENCODED",
        payload: newEncodeItems,
      });

      // Set as active encode image items
      dispatchActiveEncodeImageItem({
        type: "SET_ACTIVE_ENCODE_IMAGE",
        payload: encodeItem,
      });

      // Save in indexedDB
      storeEncodeItems.addData({ ...encodeItem });
    } catch (error) {
      reset();
      NotificationManager.warning(
        "Make sure that the GPU is enable",
        "GPU",
        3000
      );
    }
    reset();
  };

  return (
    <>
      <button
        className="custom_button bg-orange-ds text-white hover:bg-orange-ds hover:bg-opacity-80"
        onClick={() => encodeImage()}
        disabled={samApiStatus || false}
      >
        New SAM AOI
      </button>
    </>
  );
};
