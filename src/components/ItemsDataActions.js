import React, { useContext, useCallback } from "react";
import { MainContext } from "../contexts/MainContext";
import { mergePolygonClass } from "../utils/transformation";
import { olFeatures2Features, features2olFeatures } from "../utils/convert";
import { storeItems } from "../store/indexedDB";

export const ItemsDataActions = () => {
  const { items, dispatchSetItems } = useContext(MainContext);

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
    const mergedItems = features2olFeatures(mergedFeatures);

    setItems(mergedItems);
    // Save merged features in DB
    storeItems.deleteAllData();
    mergedFeatures.forEach((item) => {
      storeItems.addData({ ...item, id: item.properties.id });
    });
  };
  return (
    <div className="flex flex-row mt-3">
      <button className="custom_button w-full" onClick={() => mergePolygons()}>
        Merge overlap polygons
      </button>
    </div>
  );
};
