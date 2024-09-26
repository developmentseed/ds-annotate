import React, { useContext, useState, useEffect } from "react";
import { NotificationManager } from "react-notifications";
import { MainContext } from "../contexts/MainContext";
import {
  getDecode,
  fetchGeoJSONData,
  requestSegments,
} from "../utils/requests";
import {
  sam2Geojson,
  features2olFeatures,
  setProps2Features,
  olFeatures2Features,
  convertBbox3857to4326,
} from "../utils/convert";
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
        `Select an AOI for making predictions within it.`,
        3000
      );
      return;
    }
    dispatchDecoderType({
      type: "SET_DECODER_TYPE",
      payload: decodeType,
    });

    setSpinnerLoading(true);

    const reqProps = {
      bbox: convertBbox3857to4326(activeEncodeImageItem.bbox),
      crs: "EPSG:4326",
      zoom: activeEncodeImageItem.zoom,
      id: activeEncodeImageItem.id,
      project: activeProject.properties.slug,
    };

    const resp = await requestSegments(reqProps, "sam2/segment_automatic");

    const features = setProps2Features(
      resp.features,
      activeProject,
      activeClass,
      activeEncodeImageItem.id
    );
    const olFeatures = features2olFeatures(features);
    // Add items
    dispatchSetItems({
      type: "SET_ITEMS",
      payload: [...items, ...olFeatures],
    });

    // save in iddexedDB
    features.forEach((feature) => {
      storeItems.addData(feature);
    });

    setSpinnerLoading(false);
  };

  return (
    <div
      className={`p-2 m-1 rounded ${
        decoderType == "automatic" ? " bg-gray-300" : ""
      }`}
    >
      <div className="flex flex-row">
        <button
          className={`custom_button w-full ${
            decoderType == "automatic" ? " bg-orange-ds text-white" : ""
          }`}
          onClick={() => requestAutomatic("automatic")}
        >
          {`Automatic`}
        </button>
      </div>
    </div>
  );
};
