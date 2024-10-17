import React, { useContext } from "react";
import { NotificationManager } from "react-notifications";
import { MainContext } from "../contexts/MainContext";
import { requestSegments } from "../utils/requests";
import {
  features2olFeatures,
  setProps2Features,
  convertBbox3857to4326,
} from "../utils/convert";
import { storeItems } from "../store/indexedDB";

export const DecodeAutomatic = () => {
  const {
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
      return_format: "geojson",
      simplify_tolerance: 0.000002,
      area_val: 10,
    };

    const resp = await requestSegments(reqProps, "segment_automatic");
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
