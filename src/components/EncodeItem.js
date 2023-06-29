import React, { useContext } from "react";
import { MainContext } from "../contexts/MainContext";
import { MapContext } from "../contexts/MapContext";
import { BsTrash } from "react-icons/bs";
import { storeEncodeItems } from "./../store/indexedDB";

export const EncodeItem = ({ encodeItem, index }) => {
  const { encodeItems, dispatchEncodeItems } = useContext(MainContext);
  const { map } = useContext(MapContext);

  const zoomTo = (encodeItem) => {
    if (!map) return;
    const { bbox, zoom } = encodeItem;
    map.getView().fit(bbox);
    map.getView().setZoom(zoom);
    const newEncodeItems = encodeItems.map((e) => {
      e.selected = false;
      return e;
    });
    encodeItem.selected = true;
    newEncodeItems[index] = encodeItem;
    dispatchEncodeItems({
      type: "CACHING_ENCODED",
      payload: [...newEncodeItems],
    });
  };

  const handleRemoveEncodeItem = async (encodeItem) => {
    const updatedEncodeItems = encodeItems.filter((item, i) => {
      return item.id !== encodeItem.id;
    });
    dispatchEncodeItems({
      type: "CACHING_ENCODED",
      payload: updatedEncodeItems,
    });
    try {
      storeEncodeItems.deleteData(encodeItem.id);
    } catch (error) {
      console.error("Failed to delete encode item:", error);
    }
  };

  return (
    <div className="relative">
      <img
        src={encodeItem.canvas}
        alt={`Encode Image ${index + 1}`}
        className={`w-100 h-100 object-cover opacity-100 transition-opacity duration-500 ease-in-out transform hover:opacity-100 mb-2 ${
          encodeItem.selected ? "border border-blue-300 border-2" : ""
        }`}
        style={{
          width: "100px",
          height: "100px",
        }}
        onClick={() => zoomTo(encodeItem)}
      />
      <button
        className="absolute bottom-1 right-1 bg-red-500 hover:bg-red-600 w-4 h-4 text-white rounded flex items-center justify-center"
        onClick={() => handleRemoveEncodeItem(encodeItem)}
      >
        <BsTrash className="fill-current w-3 h-3 cursor-pointer" />
      </button>
    </div>
  );
};
