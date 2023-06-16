import React, { useContext, useState, useEffect } from "react";
import { MainContext } from "../contexts/MainContext";
import { MapContext } from "../contexts/MapContext";
import { getCanvasForLayer } from "../utils/canvas";
import { getPrediction, getEncode, getDecode, getPropertiesRequest } from "../utils/samApi";
import { olFeatures2geojson, sam2Geojson, features2olFeatures } from "../utils/featureCollection";
import { downloadGeojsonFile,getMaxIdPerClass } from '../utils/utils'
// import resp from '../static/resp_array.json'
// import {getMaxIdPerClass} from "./utils"

export const SegmentAM = ({ setLoading }) => {

  const {
    pointsSelector,
    activeProject,
    activeClass,
    dispatchSetItems,
    items,
    encodeItems,
    dispatchEncodeItems
  } = useContext(MainContext);


  const { map } = useContext(MapContext);
  const [samApiStatus, setSamApiStatus] = useState(null);

  const reset = () => {
    setLoading(false);
    setSamApiStatus(null)
  }

  const requestSAM = async (requestProps, isEncode) => {
    setLoading(true);
    //=================== Need encode ===================
    if (isEncode) {
      try {
        const canvas = await getCanvasForLayer(map, "main_layer");
        const base64 = canvas.split(';base64,')[1];
        requestProps.base64 = base64
        const encodeRespJson = await getEncode(base64);
        requestProps.image_embeddings = encodeRespJson.image_embedding;
        const encodeItem = Object.assign({}, requestProps, { canvas });
        dispatchEncodeItems({
          type: "CACHING_ENCODED",
          payload: [...encodeItems, encodeItem],
        });
      } catch (error) {
        console.log(error)
        reset();
      }

    }
    //=================== Need decode ===================
    try {
      const decodeRespJson = await getDecode(requestProps);
      const classMaxId = getMaxIdPerClass(items,activeClass)
      const features = sam2Geojson(decodeRespJson.geojsons, activeProject, activeClass, classMaxId);
      // downloadGeojsonFile(JSON.stringify(features), "decode.json");
      const samItems = features2olFeatures(features);
      dispatchSetItems({
        type: "SET_ITEMS",
        payload: [...items, ...samItems],
      });
      reset();
    } catch (error) {
      reset();
    }
  }

  useEffect(() => {
    if (!map) return;
    const requestProps = getPropertiesRequest(map, pointsSelector);
    const { bbox, zoom } = requestProps;
    const existEncodeItems = encodeItems.filter(e => {
      return e.zoom === zoom && JSON.stringify(e.bbox) === JSON.stringify(bbox)
    });
    if (existEncodeItems.length > 0) {
      requestProps.image_embeddings = existEncodeItems[0].image_embeddings;
      requestSAM(requestProps, false);
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
      // disabled={samApiStatus || false}
      >
        {samApiStatus || "Segment Anything"}
      </button>
    </div>
  );
};
