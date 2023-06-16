import React, { useContext, useCallback } from "react";
import { MainContext } from "../contexts/MainContext";
import { mergePolygonClass } from "../utils/transformation";
import {
  olFeatures2geojson,
  features2olFeatures,
} from "../utils/featureCollection";

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
    const fc = olFeatures2geojson(items);
    const mergedFeatures = mergePolygonClass(fc.features);
    const mergedItems = features2olFeatures(mergedFeatures);
    setItems(mergedItems);
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
