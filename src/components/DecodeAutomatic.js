import React, { useContext, useState, useEffect } from "react";
import { NotificationManager } from "react-notifications";
import { MainContext } from "../contexts/MainContext";
import { getDecode, fetchGeoJSONData } from "../utils/requests";
import { sam2Geojson, features2olFeatures, setProps2Features,olFeatures2Features ,convertBbox3857to4326} from "../utils/convert";
import { pointsIsInEncodeBbox } from "../utils/calculation";
import { storeItems } from "../store/indexedDB";
import { guid } from "../utils/utils";
export const DecodeAutomatic = () => {
  const {
    map,
    pointsSelector,
    dispatchSetPointsSelector,
    activeProject,
    activeClass,
    dispatchSetItems,
    items,
    activeEncodeImageItem,
    setSpinnerLoading,
    decoderType,
    dispatchDecoderType,
  } = useContext(MainContext);

  const requestAutomatic = async (decodeType) => {

    if (!activeEncodeImageItem) {
      NotificationManager.warning(
        `Enable an AOI`,
        3000
      );
      return;
    }
    dispatchDecoderType({
      type: "SET_DECODER_TYPE",
      payload: decodeType,
    });

    setSpinnerLoading(true);
    const id = guid();
    console.log('%csrc/components/DecodeAutomatic.js:40 activeProject', 'color: #007acc;', activeProject);
    const reqProps = {
      bbox: convertBbox3857to4326(activeEncodeImageItem.bbox),
      crs: "EPSG:4326",
      zoom: activeEncodeImageItem.zoom,
      id,
      project: activeProject.properties.name,
    }

    console.log('%csrc/components/DecodeAutomatic.js:48 reqProps', 'color: #007acc;', reqProps);
    const resp = await fetchGeoJSONData(activeEncodeImageItem);


    const features = setProps2Features(
      resp.geojson.features,
      activeProject,
      activeClass,
      id
    );
    const olFeatures = features2olFeatures(features);
    // Add items
    dispatchSetItems({
      type: "SET_ITEMS",
      payload: [...items, ...olFeatures],
    });
    setSpinnerLoading(false);
  }

  return (
    <div className={`p-2 m-1 rounded ${decoderType == "automatic" ? " bg-gray-300" : ""}`}>
      <div className="flex flex-row">
        <button
          className={`custom_button w-full ${decoderType == "automatic" ? " bg-orange-ds text-white" : ""}`}
          onClick={() => requestAutomatic("automatic")}
        >
          {`Automatic`}
        </button>
      </div>

    </div>
  );
};
