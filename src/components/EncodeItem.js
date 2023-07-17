import React, { useContext } from "react";
import { MainContext } from "../contexts/MainContext";
import { BsTrash } from "react-icons/bs";
import { storeEncodeItems } from "./../store/indexedDB";
import { NotificationManager } from "react-notifications";

export const EncodeItem = ({ encodeItem }) => {
  const {
    map,
    encodeItems,
    dispatchEncodeItems,
    activeEncodeImageItem,
    dispatchActiveEncodeImageItem,
  } = useContext(MainContext);

  const zoomTo = (encodeItem) => {
    if (!map) return;
    const { bbox, zoom } = encodeItem;
    map.getView().setZoom(zoom);
    map.getView().fit(bbox, { padding: [5, 5, 5, 5] });
    // Set as active encode image items
    dispatchActiveEncodeImageItem({
      type: "SET_ACTIVE_ENCODE_IMAGE",
      payload: encodeItem,
    });
  };

  const handleRemoveEncodeItem = async (encodeItem) => {
    if (encodeItem.id === activeEncodeImageItem.id) {
      // NotificationManager.warning(
      //   `You can't remove active encode view`,
      //   "",
      //   10000
      // );
      dispatchActiveEncodeImageItem({
        type: "SET_ACTIVE_ENCODE_IMAGE",
        payload: null,
      });
    }

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
    <div className=" relative inline-flex justify-center items-center pr-1 pl-1 ml-1 text-xs text-slate-900 font-medium rounded-full cursor-pointer">
      <img
        src={encodeItem.canvas}
        alt={`Encode Image`}
        className={`w-full h-full object-cover opacity-100 transition-opacity duration-500 ease-in-out transform hover:opacity-90 mb-2 
      ${
        activeEncodeImageItem && encodeItem.id === activeEncodeImageItem.id
          ? "border border-green-400 border-2"
          : "border border-gray-300 border-2"
      }`}
        style={{
          width: "100px",
          height: "100px",
        }}
        onClick={() => zoomTo(encodeItem)}
      />

      <div className="absolute top-1 left-1 p-1 text-xxs bg-yellow-500 e rounded opacity-80 backdrop-filter backdrop-blur-md flex items-center space-x-2">
        <p className="font-bold text-gray">{`[${encodeItem.image_shape[1]},${
          encodeItem.image_shape[0]
        }] - z${Math.round(encodeItem.zoom)} `}</p>
      </div>

      <div className="absolute bottom-1 right-1 p-1 text-xs bg-red-500 rounded opacity-90 backdrop-filter backdrop-blur-md flex items-center space-x-2">
        <BsTrash
          onClick={() => handleRemoveEncodeItem(encodeItem)}
          className="text-white fill-current w-3 h-3 cursor-pointer"
        />
      </div>
    </div>
  );
};
