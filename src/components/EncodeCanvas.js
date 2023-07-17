import React, { useContext, useState, useEffect } from "react";
import { NotificationManager } from "react-notifications";

import { MainContext } from "../contexts/MainContext";
import { getCanvasForLayer } from "../utils/canvas";
import { getEncode, getDecode, getPropertiesRequest } from "../utils/requests";
import { sam2Geojson, features2olFeatures } from "../utils/convert";
import { pointIsInEncodeBbox } from "../utils/calculation";
import { storeEncodeItems, storeItems } from "../store/indexedDB";
import { guid } from "../utils/utils";

export const EncodeCanvas = () => {
  const {
    map,
    pointsSelector,
    activeProject,
    activeClass,
    dispatchSetItems,
    items,
    encodeItems,
    dispatchEncodeItems,
    activeEncodeImageItem,
    dispatchActiveEncodeImageItem,
    setSpinnerLoading,
  } = useContext(MainContext);

  const [samApiStatus, setSamApiStatus] = useState(null);

  const reset = () => {
    setSpinnerLoading(false);
    setSamApiStatus(null);
  };

  const [notificationShown, setNotificationShown] = useState(false);

  // Request segment-anything-services
  const requestSAM = async (requestProps, isEncode) => {
    setSpinnerLoading(true);

    let newEncodeItems = encodeItems;

    //=================== Encode ===================
    if (isEncode) {
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
      }
    }
    // =================== Decode ===================
    try {
      const decodeRespJson = await getDecode(requestProps);
      const id = guid();
      const features = sam2Geojson(
        decodeRespJson.geojsons,
        activeProject,
        activeClass,
        id
      );
      const olFeatures = features2olFeatures(features);
      dispatchSetItems({
        type: "SET_ITEMS",
        payload: [...items, ...olFeatures],
      });

      // save in DB
      const feature = features[0];
      storeItems.addData({ ...feature, id });
      reset();
    } catch (error) {
      reset();
    }
    reset();
  };

  const showNotification = () => {
    if (!notificationShown) {
      NotificationManager.warning(
        `Click inside an AOI, or click the 'New SAM AOI' button to create a new AOI.`,
        "",
        4000
      );
      setNotificationShown(true);

      // Reactivate the notification after a minute
      setTimeout(() => {
        setNotificationShown(false);
      }, 10 * 1000); // 60 seconds times 1000 milliseconds per second
    }
  };
  useEffect(() => {
    if (!map) return;
    if (!activeEncodeImageItem) return;
    const { x, y } = pointIsInEncodeBbox(activeEncodeImageItem, pointsSelector);
    if (x && y) {
      const input_point = [x, y];
      const { image_embeddings, image_shape, input_label, crs, bbox, zoom } =
        activeEncodeImageItem;
      const newRequestProps = {
        image_embeddings,
        image_shape,
        input_label,
        crs,
        bbox,
        zoom,
        input_point,
      };
      requestSAM(newRequestProps, false);
    } else {
      showNotification();
    }
  }, [pointsSelector]);

  const requestPrediction = async () => {
    const requestProps = getPropertiesRequest(map, pointsSelector);
    requestSAM(requestProps, true);
  };

  return (
    <>
      <button
        className="custom_button"
        onClick={() => {
          requestPrediction();
        }}
        disabled={samApiStatus || false}
      >
        New SAM AOI
      </button>
    </>
  );
};
