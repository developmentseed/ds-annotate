import React, { useContext, useState, useEffect } from "react";
import { NotificationManager } from "react-notifications";
import log from "loglevel";

import { MainContext } from "../contexts/MainContext";
import { getCanvasForLayer } from "../utils/canvas";
import {
  getEncode,
  getDecode,
  getPropertiesRequest,
  requestSangeo,
  fetchGeoJSONData,
  setAOI,
} from "../utils/requests";
import {
  sam2Geojson,
  features2olFeatures,
  setProps2Features,
  saveFeaturesToGeoJSONFile,
  convertBbox4326to3857,
} from "../utils/convert";
import { pointIsInEncodeBbox, pointIsInBbox } from "../utils/calculation";
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
  const [notificationShown, setNotificationShown] = useState(false);

  const reset = () => {
    setSpinnerLoading(false);
  };

  const requestSAMAOI = async (requestProps) => {
    setSpinnerLoading(true);
    try {
      const canvas = await getCanvasForLayer(map, "main_layer");

      const encodeItem = Object.assign({}, requestProps, {
        canvas,
        id: guid(),
        project: activeProject.properties.slug,
      });

      const respEncodeItem = await setAOI(encodeItem);

      respEncodeItem.bbox = convertBbox4326to3857(respEncodeItem.bbox);
      const newEncodeItems = [...encodeItems, respEncodeItem];

      // Set encode items
      dispatchEncodeItems({
        type: "CACHING_ENCODED",
        payload: newEncodeItems,
      });

      // Set as active encode image items
      dispatchActiveEncodeImageItem({
        type: "SET_ACTIVE_ENCODE_IMAGE",
        payload: respEncodeItem,
      });
    } catch (error) {
      reset();
    }
    reset();
  };

  const requestAOI = async () => {
    const requestProps = getPropertiesRequest(map, pointsSelector);
    requestSAMAOI(requestProps, true);
  };

  return (
    <>
      <button
        className="custom_button bg-orange-ds text-white hover:bg-orange-ds hover:bg-opacity-80"
        onClick={() => requestAOI()}
        // disabled={samApiStatus || false}
      >
        New SAM AOI
      </button>
    </>
  );
};
