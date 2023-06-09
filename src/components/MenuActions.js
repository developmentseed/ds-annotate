import React, { useContext, useCallback } from "react";
import { MainContext } from "../contexts/MainContext";
import { BsViewList } from "react-icons/bs";
import { unionPolygons } from "../utils/transformation";
import {
  olFeatures2geojson,
  geojson2olFeatures,
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
    const mergedFeatures = unionPolygons(fc.features);
    const mergedItems = geojson2olFeatures(mergedFeatures);
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
      {/* <div className="menuHeader">
        <BsViewList></BsViewList>
        <span className="text-sm text-base font-small flex-1 duration-200 false">
          Polygon Action
        </span>
      </div> */}
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
