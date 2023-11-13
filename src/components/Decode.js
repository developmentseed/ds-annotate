import React, { useContext, useState, useEffect } from "react";
import { NotificationManager } from "react-notifications";
import { MainContext } from "../contexts/MainContext";
import { getDecode } from "../utils/requests";
import { sam2Geojson, features2olFeatures } from "../utils/convert";
import { pointsIsInEncodeBbox } from "../utils/calculation";
import { storeItems } from "../store/indexedDB";

export const Decode = () => {
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

  const decodePrompt = async (requestProps) => {
    setSpinnerLoading(true);
    try {
      const decodeRespJson = await getDecode(requestProps);
      const features = sam2Geojson(
        decodeRespJson.geojsons,
        activeProject,
        activeClass
      );
      const olFeatures = features2olFeatures(features);
      // Add items
      dispatchSetItems({
        type: "SET_ITEMS",
        payload: [...items, ...olFeatures],
      });

      // Set empty the point selectors
      dispatchSetPointsSelector({
        type: "SET_EMPTY_POINT",
        payload: [],
      });

      // save in iddexedDB
      features.forEach((feature) => {
        storeItems.addData(feature);
      });
      setSpinnerLoading(false);
    } catch (error) {
      // TODO display error
      setSpinnerLoading(false);
    }
  };

  const buildReqProps = (
    activeEncodeImageItem,
    pointsSelector,
    decoderType
  ) => {
    let input_point;
    let input_label;
    // Get pixels fro each point the is in the map
    const listPixels = pointsIsInEncodeBbox(
      activeEncodeImageItem,
      pointsSelector
    );

    if (decoderType === "single_point") {
      input_point = listPixels[0];
      input_label = 1;
    } else if (
      decoderType === "multi_point" ||
      decoderType === "multi_point_split"
    ) {
      input_point = listPixels;
      // TODO ,Fix here for foreground and background labels.
      input_label = input_point.map((i) => 1);
    }

    // Get propos from encode items
    const { image_embeddings, image_shape, crs, bbox, zoom } =
      activeEncodeImageItem;

    // Build props to request to the decoder API
    const reqProps = {
      image_embeddings,
      image_shape,
      input_label,
      crs,
      bbox,
      zoom,
      input_point,
      decode_type: decoderType,
    };

    return reqProps;
  };

  // Single point is activate owhen we do a click on the map
  useEffect(() => {
    if (!map) return;
    if (pointsSelector.length === 0) return;
    if (!activeEncodeImageItem) {
      NotificationManager.warning(
        `Click inside of active AOI to enable Segment Anything Model.`,
        3000
      );
    }

    // Request in case it is a single point
    if (decoderType == "single_point") {
      const reqProps = buildReqProps(
        activeEncodeImageItem,
        pointsSelector,
        decoderType
      );
      decodePrompt(reqProps);
    }
  }, [pointsSelector]);

  // Multipoint is activate when press the request decode buttom
  const decodeItems = async (multiDecoderType) => {
    if (pointsSelector.length === 0) return;
    const reqProps = buildReqProps(
      activeEncodeImageItem,
      pointsSelector,
      multiDecoderType
    );
    await decodePrompt(reqProps);
  };

  const setDecodeType = (decodeType) => {
    // If the decoder type changes, we need to change the single point to the
    // latest multi-point clicked.
    dispatchDecoderType({
      type: "SET_DECODER_TYPE",
      payload: decodeType,
    });

    if (decodeType === "single_point") {
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

      <div className="grid grid-cols-2 gap-2 mt-2">
        <button
          className={`custom_button w-full`}
          onClick={() => decodeItems("multi_point")}
        >
          {`Request an item`}
        </button>
        <button
          className={`custom_button w-full`}
          onClick={() => decodeItems("multi_point_split")}
        >
          {`Request multi items`}
        </button>
      </div>
    </>
  );
};
