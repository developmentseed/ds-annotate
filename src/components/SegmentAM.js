import React, { useContext, useState, useEffect } from "react";
import * as turf from "@turf/turf";
import VectorSource from "ol/source/Vector";

import { MainContext } from "../contexts/MainContext";
import { MapContext } from "../contexts/MapContext";
import { getCanvasForLayer } from "../utils/canvas";
import { getEncode, getDecode, getPropertiesRequest } from "../utils/samApi";
import {
  sam2Geojson,
  features2olFeatures,
  bbox2polygon,
  getOLFeatures,
} from "../utils/convert";
import { pointIsInEncodeBbox } from "../utils/calculation";
import { encodeMapViews } from "./map/layers";

import {
  openDatabase,
  storeEncodeItems,
  storeItems,
} from "./../store/indexedDB";
import { guid } from "./../utils/utils";

export const SegmentAM = ({ setLoading }) => {
  const {
    pointsSelector,
    activeProject,
    activeClass,
    dispatchSetItems,
    items,
    encodeItems,
    dispatchEncodeItems,
    activeEncodeImageItem,
    dispatchActiveEncodeImageItem,
  } = useContext(MainContext);

  const { map } = useContext(MapContext);
  const [samApiStatus, setSamApiStatus] = useState(null);

  const reset = () => {
    setLoading(false);
    setSamApiStatus(null);
  };

  // Load indexedDB for encode Items
  useEffect(() => {
    const fetchData = async () => {
      try {
        await openDatabase();
        const listEncodeItems = await storeEncodeItems.getAllData();

        dispatchEncodeItems({
          type: "CACHING_ENCODED",
          payload: listEncodeItems,
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleSaveData = async (data, table) => {
    try {
      await storeEncodeItems.addData(data);
    } catch (error) {
      console.error("Failed to save data:", error);
    }
  };

  // Request segment-anything-services
  const requestSAM = async (requestProps, isEncode) => {
    setLoading(true);

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
    }
  }, [pointsSelector]);

  const requestPrediction = async () => {
    const requestProps = getPropertiesRequest(map, pointsSelector);
    requestSAM(requestProps, true);
  };

  return (
    <div className="absolute bottom-1 left-2 z-50">
      <button
        type="button"
        className="custom_button bg-red-500 text-white"
        onClick={() => {
          requestPrediction();
        }}
        disabled={samApiStatus || false}
      >
        {samApiStatus || "Segment Anything"}
      </button>
    </div>
  );
};
