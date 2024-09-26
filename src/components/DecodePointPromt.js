import React, { useContext, useState, useEffect } from "react";
import { NotificationManager } from "react-notifications";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import VectorSource from "ol/source/Vector";

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
import { vectorPointSelector } from "./map/layers";

export const DecodePointPromt = () => {
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

  const [displayPointPromtsMenu, setDisplayPointPromtsMenu] = useState(false);
  const [isForegroundPromtPoint, setIsForegroundPromtPoint] = useState(true);
  const [points, setPoints] = useState([]);

  const setDecodeType = (decodeType) => {
    dispatchDecoderType({
      type: "SET_DECODER_TYPE",
      payload: decodeType,
    });
    setDisplayPointPromtsMenu(!displayPointPromtsMenu);
  };

  // // Add point to send request to SAM
  useEffect(() => {
    if (!map) return;
    if (decoderType !== "single_point") return;
    if (!activeEncodeImageItem) {
      NotificationManager.warning(
        `Select an AOI for making predictions within it.`,
        3000
      );
      return;
    }

    const clickHandler = function (e) {
      const coordinates = e.coordinate;
      const point = new Feature(new Point(coordinates));

      const color = isForegroundPromtPoint ? [46, 62, 255] : [253, 23, 23];
      const label = isForegroundPromtPoint ? 1 : 0;
      point.setProperties({
        px: Math.ceil(e.pixel[0]),
        py: Math.ceil(e.pixel[1]),
        color,
        label,
      });
      setPoints((prevPoints) => [...prevPoints, point]);
    };
    map.on("click", clickHandler);
    return () => map.un("click", clickHandler);
  }, [map, decoderType, activeEncodeImageItem, isForegroundPromtPoint]);

  useEffect(() => {
    const pointsSelectorDataSource = new VectorSource({
      features: points,
      wrapX: true,
    });
    vectorPointSelector.setSource(pointsSelectorDataSource);
  }, [points]);

  const requestPointPromt = async (actionType) => {
    if (!map) return;
    if (decoderType !== "single_point" && decoderType !== "multi_point") return;
    if (!activeEncodeImageItem) {
      NotificationManager.warning(
        `Select an AOI for making predictions within it.`,
        3000
      );
      return;
    }
    if (points.length < 1) {
      NotificationManager.warning(
        `Set at least one point to make predictions.`,
        3000
      );
      return;
    }
    setSpinnerLoading(true);
    const featuresPoints = olFeatures2Features(points);
    const coordinatesArray = featuresPoints.map(
      (feature) => feature.geometry.coordinates
    );
    const labelsArray = featuresPoints.map(
      (feature) => feature.properties.label
    );

    const reqProps = {
      bbox: convertBbox3857to4326(activeEncodeImageItem.bbox),
      point_labels: labelsArray,
      point_coords: coordinatesArray,
      crs: "EPSG:4326",
      zoom: activeEncodeImageItem.zoom,
      id: activeEncodeImageItem.id,
      project: activeProject.properties.slug,
      action_type: actionType,
    };
    const resp = await requestSegments(reqProps, "sam2/segment_predictor");
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

    setPoints([]);
    // save in iddexedDB
    // const items_id = guid()
    // features.forEach((feature, index) => {
    //   feature.id = `${items_id}_${index}`
    //   feature.properties.id = `${items_id}_${index}`
    //   storeItems.addData(feature);
    // });
    setSpinnerLoading(false);
  };

  return (
    <div
      className={`p-2 m-1 rounded ${
        decoderType == "single_point" ? " bg-gray-200" : ""
      }`}
    >
      <div className="flex flex-row">
        <button
          className={`custom_button w-full ${
            decoderType == "single_point" ? " bg-orange-ds text-white" : ""
          }`}
          onClick={() => setDecodeType("single_point")}
        >
          {`Point Input prompts`}
        </button>
      </div>
      {decoderType == "single_point" && (
        <>
          <div className="flex space-x-2 mt-2">
            <button
              className={`custom_button w-40 px-2 py-1 ${
                isForegroundPromtPoint ? " bg-orange-ds text-white" : ""
              }`}
              onClick={() => setIsForegroundPromtPoint(true)}
            >
              Foreground
            </button>
            <button
              className={`custom_button w-40 px-2 py-1 ${
                !isForegroundPromtPoint ? " bg-orange-ds text-white" : ""
              }`}
              onClick={() => setIsForegroundPromtPoint(false)}
            >
              Background
            </button>
          </div>
          <div className="flex flex-row mt-3">
            <button
              className={`custom_button w-full`}
              onClick={() => requestPointPromt("single_point")}
            >
              {"Detect single polygon"}
            </button>
          </div>
          <div className="flex flex-row mt-3">
            <button
              className={`custom_button w-full`}
              onClick={() => requestPointPromt("multi_point")}
            >
              {"Detect multi polygon"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
