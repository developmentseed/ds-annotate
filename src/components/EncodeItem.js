import React, { useContext, useState } from "react";
import { MainContext } from "../contexts/MainContext";
import { MapContext } from "../contexts/MapContext";

// import { BsTrash } from "react-icons/bs";
// import { MainContext } from "./../contexts/MainContext";

export const EncodeItem = ({ encodeItem, index }) => {
  const { encodeItems, dispatchEncodeItems } = useContext(MainContext);

  const { map } = useContext(MapContext);

  const zoomTo = (encodeItem) => {
    if (!map) return;
    const { bbox, zoom } = encodeItem;
    map.getView().fit(bbox);
    map.getView().setZoom(zoom);
    const newEncodeItems = encodeItems.map(e => { e.selected = false; return e; })
    encodeItem.selected = true;
    newEncodeItems[index] = encodeItem;
    dispatchEncodeItems({
      type: "CACHING_ENCODED",
      payload: [...newEncodeItems],
    });
  };
  return (
    <img
      src={encodeItem.canvas}
      alt={`Encode Image ${index + 1}`}
      className={`w-100 h-100 object-cover opacity-100 transition-opacity duration-500 ease-in-out transform hover:opacity-100 mb-2 ${encodeItem.selected ? "border border-blue-300 border-2" : ""}`}
      style={{
        width: "100px",
        height: "100px"
      }}
      onClick={() => {
        zoomTo(encodeItem);
      }}
    />
  );
}