import React, { useContext, useState, useEffect } from "react";
import { NotificationManager } from "react-notifications";
import { MainContext } from "../contexts/MainContext";
import { getDecode, fetchGeoJSONData } from "../utils/requests";
import {
  sam2Geojson,
  features2olFeatures,
  setProps2Features,
} from "../utils/convert";
import { pointsIsInEncodeBbox } from "../utils/calculation";
import { storeItems } from "../store/indexedDB";
import { guid } from "../utils/utils";

import { DecodeAutomatic } from "./DecodeAutomatic";
import { DecodePointPromt } from "./DecodePointPromt";
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

  const [displayPointPromtsMenu, setDisplayPointPromtsMenu] = useState(false);
  const [isForegroundPromtPoint, setIsForegroundPromtPoint] = useState(true);

  const decodePrompt = async (requestProps) => {
    setSpinnerLoading(true);
    try {
      // const decodeRespJson = await getDecode(requestProps);

      const resp = await fetchGeoJSONData(requestProps);

      const id = guid();
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

  const requestAutomatic = async (activeEncodeImageItemProps) => {
    const resp = await fetchGeoJSONData(activeEncodeImageItemProps);
    const id = guid();
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

    if (decodeType === "automatic") {
      requestAutomatic(activeEncodeImageItem);
    }

    if (decodeType === "single_point") {
      setDisplayPointPromtsMenu(!displayPointPromtsMenu);
    }
  };

  return (
    <>
      <DecodePointPromt />
      <DecodeAutomatic />
    </>
  );
};
