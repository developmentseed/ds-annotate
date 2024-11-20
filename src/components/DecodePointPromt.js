import React, { useContext, useState, useEffect } from "react";
import { NotificationManager } from "react-notifications";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
// import VectorSource from "ol/source/Vector";

import { MainContext } from "../contexts/MainContext";
import { requestSegments } from "../utils/requests";
import {
  features2olFeatures,
  setProps2Features,
  olFeatures2Features,
  convertBbox3857to4326,
} from "../utils/convert";
import { storeItems } from "../store/indexedDB";
import { guid } from "../utils/utils";
import { vectorPointSelector } from "./map/layers";

export const DecodePointPromt = () => {
  const {
    map,
    activeProject,
    activeClass,
    dispatchSetItems,
    items,
    activeEncodeImageItem,
    setSpinnerLoading,
    decoderType,
    dispatchDecoderType,
  } = useContext(MainContext);

  const [selectedTab, setSelectedTab] = useState("singlePolygon");
  const [isForegroundPromtPoint, setIsForegroundPromtPoint] = useState(true);
  // const [points, setPoints] = useState([]);

  const setDecodeType = (decodeType) => {
    dispatchDecoderType({
      type: "SET_DECODER_TYPE",
      payload: decodeType,
    });
  };

  // Add point to send request to SAM
  useEffect(() => {
    if (!map ) {
      // if (!activeEncodeImageItem) {
      //   NotificationManager.warning(
      //     `Select an AOI for making predictions within it.`,
      //     3000
      //   );
      // }
      return;
    }

    const clickHandler = (e) => {
      const coordinates = e.coordinate;
      const point = new Feature({
        geometry: new Point(coordinates),
      });

      const color = isForegroundPromtPoint ? [46, 62, 255] : [253, 23, 23];
      const label = isForegroundPromtPoint ? 1 : 0;
      point.setProperties({
        px: Math.ceil(e.pixel[0]),
        py: Math.ceil(e.pixel[1]),
        color,
        label,
      });
      const source = vectorPointSelector.getSource();
      source.addFeature(point);
      setTimeout(() => {
        point.setStyle(null);
        vectorPointSelector.changed();
      }, 500);
    };

    map.on("click", clickHandler);
    return () => map.un("click", clickHandler);
  }, [map, decoderType, activeEncodeImageItem, isForegroundPromtPoint]);


  const requestPointPromt = async (actionType) => {
    const points = vectorPointSelector.getSource().getFeatures();
    if (!map || !activeEncodeImageItem || points.length < 1) {
      NotificationManager.warning(
        `Please ensure an AOI and at least one point are selected for predictions.`,
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
      return_format: "geojson",
      simplify_tolerance: 0.000002,
      area_val: 20,
    };
    const resp = await requestSegments(reqProps, "segment_predictor");
    const features = setProps2Features(
      resp.features,
      activeProject,
      activeClass,
      activeEncodeImageItem.id
    );
    const olFeatures = features2olFeatures(features);
    dispatchSetItems({
      type: "SET_ITEMS",
      payload: [...items, ...olFeatures],
    });

    // setPoints([]);
    vectorPointSelector.getSource().clear();
    const items_id = guid();
    features.forEach((feature, index) => {
      feature.id = `${items_id}_${index}`;
      feature.properties.id = `${items_id}_${index}`;
      storeItems.addData(feature);
    });
    setSpinnerLoading(false);
  };

  const tagChangeHandler = (type) => {
    vectorPointSelector.getSource().clear();
    if (type === "single_point") {
      setSelectedTab("singlePolygon");
      setDecodeType("single_point");
    } else {
      setSelectedTab("multiPolygon");
      setDecodeType("multi_point");

      setIsForegroundPromtPoint(true)
    }

  }

  return (
    <div className="p-1 m-1 rounded bg-gray-100">
      {/* Tab Navigation */}
  <div className="flex border-b border-gray-300 mb-4">
    <button
      className={`flex-1 text-sm focus:outline-none transition-all duration-300 ${
        selectedTab === "singlePolygon"
          ? "border-b-2font-semibold text-orange-ds "
          : "text-gray-600 "
      }`}
      onClick={() => 
        tagChangeHandler("single_point")
      }
    >
      Single
    </button>
    <button
      className={`flex-1 text-sm focus:outline-none transition-all duration-300 ${
        selectedTab === "multiPolygon"
          ? "border-b-2font-semibold text-orange-ds "
          : "text-gray-600 "
      }`}
      onClick={() => tagChangeHandler("multi_point")}
    >
      Multi
    </button>
  </div>


      {/* Tab Content based on Selected Tab */}
      <div className="mt-4">
        {selectedTab === "singlePolygon" && (
          <>

            {/* Foreground and Background Buttons */}
            <div className="flex space-x-2 mt-2">
              <button
                className={`custom_button w-40 px-2 py-1 ${isForegroundPromtPoint ? "bg-orange-ds text-white" : ""
                  }`}
                onClick={() => setIsForegroundPromtPoint(true)}
              >
                Foreground
              </button>
              <button
                className={`custom_button w-40 px-2 py-1 ${!isForegroundPromtPoint ? "bg-orange-ds text-white" : ""
                  }`}
                onClick={() => setIsForegroundPromtPoint(false)}
              >
                Background
              </button>
            </div>
            <button
              className="custom_button w-full text-white mt-3 bg-orange-ds"
              onClick={() => requestPointPromt("single_point")}
            >
              Detect Single Polygon
            </button>
          </>

        )}
        {selectedTab === "multiPolygon" && (
          <button
            className="custom_button w-full text-white bg-orange-ds"
            onClick={() => requestPointPromt("multi_point")}
          >
            Detect Multi Polygon
          </button>
        )}
      </div>
    </div>
  );
};