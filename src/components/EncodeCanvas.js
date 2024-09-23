import React, { useContext, useState, useEffect } from "react";
import { NotificationManager } from "react-notifications";
import log from 'loglevel';

import { MainContext } from "../contexts/MainContext";
import { getCanvasForLayer } from "../utils/canvas";
import { getEncode, getDecode, getPropertiesRequest, requestSangeo, fetchGeoJSONData } from "../utils/requests";
import { sam2Geojson, features2olFeatures, setProps2Features, saveFeaturesToGeoJSONFile } from "../utils/convert";
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
    // setSamApiStatus(null);
  };

  // Request segment-anything-services
  const requestSAMAOI = async (requestProps) => {
    setSpinnerLoading(true);
    //=================== Encode ===================
    try {
      const canvas = await getCanvasForLayer(map, "main_layer");
      const encodeItem = Object.assign({}, requestProps, {
        canvas,
        image_embeddings: "",
        id: guid(),
        project: activeProject.properties.name,
      });
      const newEncodeItems = [...encodeItems, encodeItem];

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
    reset();
  };

  // const resquestPredictions = async (requestProps) => {
  //   // =================== Decode ===================
  //   try {
  //     // const resp = await requestSangeo(requestProps);
  //     const resp = await fetchGeoJSONData(requestProps);

  //     // saveFeaturesToGeoJSONFile(resp.geojson.features);
  //     console.log("====");

  //     const id = guid();
  //     const features = setProps2Features(
  //       resp.geojson.features,
  //       activeProject,
  //       activeClass,
  //       id
  //     );

  //     console.log(features);

  //     const olFeatures = features2olFeatures(features);
  //     console.log(olFeatures)
  //     dispatchSetItems({
  //       type: "SET_ITEMS",
  //       payload: [...items, ...olFeatures],
  //     });

  //     // save in DB
  //     const feature = features[0];
  //     storeItems.addData({ ...feature, id });
  //     reset();
  //   } catch (error) {
  //     reset();
  //   }
  // }


  const showNotification = (text, duration) => {
    if (!notificationShown) {
      NotificationManager.warning(text, "Map interaction", duration);
      setNotificationShown(true);
      // Reactivate the notification after a 10 sec
      setTimeout(() => {
        setNotificationShown(false);
      }, 10 * 1000);
    }
  };

  // useEffect(() => {
  //   if (!map) return;
  //   if (activeEncodeImageItem) {
  //     const { isPointInPolygon, pointFeature, bbox } = pointIsInBbox(
  //       activeEncodeImageItem,
  //       pointsSelector
  //     );

  //     const { image_shape, input_label, crs, zoom } = activeEncodeImageItem;
  //     log.info(image_shape, input_label, crs, zoom);
  //     const newRequestProps = {
  //       bbox,
  //       crs,
  //       zoom,
  //       id: activeProject.properties.slug,
  //       project: activeProject.properties.name,
  //     };

  //     requestSAM(newRequestProps, false);

  //   } else {
  //     showNotification(
  //       `Click inside of active AOI to enable Segment Anything Model.`
  //     );
  //   }

  // }, [pointsSelector]);

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