import React, { useContext, useState, useEffect } from "react";
import { NotificationManager } from "react-notifications";

import { MainContext } from "../contexts/MainContext";
import { getCanvasForLayer } from "../utils/canvas";
import { getEncode, getDecode, getPropertiesRequest } from "../utils/requests";
import { sam2Geojson, features2olFeatures } from "../utils/convert";
import { pointsIsInEncodeBbox } from "../utils/calculation";
import { guid } from "../utils/utils";
import { storeEncodeItems, storeItems } from "../store/indexedDB";

export const Decode = () => {
  const {
    map,
    pointsSelector,
    dispatchSetPointsSelector,
    activeProject,
    activeClass,
    dispatchSetItems,
    items,
    encodeItems,
    dispatchEncodeItems,
    activeEncodeImageItem,
    dispatchActiveEncodeImageItem,
    setSpinnerLoading,
    decoderType,
    dispatchDecoderType,
  } = useContext(MainContext);

  const decodePrompt = async (requestProps) => {
    setSpinnerLoading(true);
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
      setSpinnerLoading(false);
    } catch (error) {
      // TODO display error
      setSpinnerLoading(false);
    }
  };

  // Single point is activate owhen we do a click on the map
  useEffect(() => {
    if (!map) return;
    if (pointsSelector.length === 0) return;
    if (decoderType != "single_point") return;

    if (activeEncodeImageItem) {
      const listPixels = pointsIsInEncodeBbox(
        activeEncodeImageItem,
        pointsSelector
      );
      if (listPixels.length > 0) {
        const input_point = listPixels[0];
        const input_label = 1;
        const { image_embeddings, image_shape, crs, bbox, zoom } =
          activeEncodeImageItem;
        const newRequestProps = {
          image_embeddings,
          image_shape,
          input_label,
          crs,
          bbox,
          zoom,
          input_point,
          decode_type: decoderType,
        };
        decodePrompt(newRequestProps);
      } else {
        NotificationManager.warning(
          `Click inside of active AOI to enable Segment Anything Model.`,
          3000
        );
      }
    }
  }, [pointsSelector]);

  // Multipoint is activate when press the request decode buttom
  const decodeBycolor = () => {
    if (!map) return;
    if (pointsSelector.length === 0) return;
    if (activeEncodeImageItem) {
      const listPixels = pointsIsInEncodeBbox(
        activeEncodeImageItem,
        pointsSelector
      );
      if (listPixels.length > 0) {
        const input_point = listPixels;
        const input_label = input_point.map((i) => 1);
        const { image_embeddings, image_shape, crs, bbox, zoom } =
          activeEncodeImageItem;
        const newRequestProps = {
          image_embeddings,
          image_shape,
          input_label,
          crs,
          bbox,
          zoom,
          input_point,
          decode_type: decoderType,
        };
        decodePrompt(newRequestProps);
        // dispatchSetPointsSelector({
        //   type: "SET_EMPTY_POINT",
        //   payload: [],
        // });
      } else {
        NotificationManager.warning(
          `Click inside of active AOI to enable Segment Anything Model.`,
          3000
        );
      }
    }
  };

  const decodeByclass = () => {};

  const setDecodeType = (decodeType) => {
    dispatchDecoderType({
      type: "SET_DECODER_TYPE",
      payload: decodeType,
    });

    if (decodeType == "single_point" && pointsSelector.length > 0) {
      dispatchSetPointsSelector({
        type: "SET_SINGLE_POINT",
        payload: pointsSelector[pointsSelector.length - 1],
      });
    }
  };

  return (
    <>
      <div className="flex flex-row mt-3">
        <button
          className={`custom_button w-full ${
            decoderType == "single_point" ? " bg-orange-ds text-white" : ""
          }`}
          onClick={() => setDecodeType("single_point")}
        >
          {`Active Single point`}
        </button>
      </div>
      <div className="flex flex-row mt-3">
        <button
          className={`custom_button w-full ${
            decoderType == "multi_point" ? "bg-orange-ds text-white" : ""
          }`}
          onClick={() => setDecodeType("multi_point")}
        >
          {`Active Multi point`}
        </button>
      </div>

      <div className="flex flex-row mt-3">
        <button
          className={`custom_button w-full`}
          onClick={() => decodeBycolor()}
        >
          {`Request by color`}
        </button>
        <button
          className={`custom_button w-full`}
          onClick={() => decodeByclass()}
        >
          {`Request by class`}
        </button>
      </div>
    </>
  );
};
