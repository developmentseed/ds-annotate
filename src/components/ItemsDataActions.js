import React, { useContext, useCallback } from "react";
import { MainContext } from "../contexts/MainContext";
import {
  mergePolygonClass,
  simplifyFeatures,
  smooth,
} from "../utils/transformation";
import { olFeatures2Features, features2olFeatures } from "../utils/convert";
import { storeItems } from "../store/indexedDB";

export const ItemsDataActions = () => {
  const { items, dispatchSetItems, activeProject, activeEncodeImageItem } =
    useContext(MainContext);

  const setItems = useCallback(
    (items) => {
      dispatchSetItems({
        type: "SET_ITEMS",
        payload: items,
      });
    },
    [dispatchSetItems]
  );

  const mergePolygons = () => {
    const features = olFeatures2Features(items);
    const mergedFeatures = mergePolygonClass(features);
    const smoothFeatures = smooth(mergedFeatures);
    const simpFeatures = simplifyFeatures(smoothFeatures, 0.000002);
    const mergedItems = features2olFeatures(simpFeatures);
    setItems(mergedItems);
    // Save merged features in DB
    storeItems.deleteDataByProject(activeProject.properties.name);
    mergedFeatures.forEach((item) => {
      storeItems.addData({
        ...item,
        id: item.properties.id,
        project: activeProject.properties.name,
      });
    });
  };

  return (
    <div className="flex flex-row mt-3">
      <button className="custom_button w-full" onClick={() => mergePolygons()}>
        Merge overlapping features
      </button>
    </div>
  );
};
