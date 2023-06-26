import React, { useContext, useCallback } from "react";
import { MainContext } from "../contexts/MainContext";
import { mergePolygonClass } from "../utils/transformation";
import { olFeatures2Features, features2olFeatures } from "../utils/convert";

export const MenuActions = () => {
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

  const mergPolygons = () => {
    const features = olFeatures2Features(items);
    const mergedFeatures = mergePolygonClass(features);
    const mergedItems = features2olFeatures(mergedFeatures);
    setItems(mergedItems);
    // Save merged features in DB
  };

  document.addEventListener("keydown", (e) => {
    // Merge polygonos
    if (e.key === "m") {
      mergPolygons();
    }
  });
  return (
    <div>
      <div className="flex flex-row mt-3">
        <button
          className="custom_button"
          onClick={() => {
            mergPolygons();
          }}
        >
          Merge polygons (M)
        </button>
      </div>
    </div>
  );
};
