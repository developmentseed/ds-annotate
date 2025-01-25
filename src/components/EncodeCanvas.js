import React, { useContext } from "react";
import { MainContext } from "../contexts/MainContext";
import { getCanvasForLayer } from "../utils/canvas";
import { getPropertiesRequest, setAOI } from "../utils/requests";
import { convertBbox4326to3857 } from "../utils/convert";
import { guid } from "../utils/utils";

export const EncodeCanvas = () => {
  const {
    map,
    pointsSelector,
    activeProject,
    encodeItems,
    dispatchEncodeItems,
    dispatchActiveEncodeImageItem,
    setSpinnerLoading,
  } = useContext(MainContext);

  const reset = () => {
    setSpinnerLoading(false);
  };

  const requestSAMAOI = async (requestProps) => {
    setSpinnerLoading(true);
    try {
      const canvas = await getCanvasForLayer(map, "main_layer");

      const encodeItem = {
        ...requestProps,
        canvas,
        id: guid(),
        project: activeProject.properties.slug,
      };

      const respEncodeItem = await setAOI(encodeItem);
      respEncodeItem.bbox = convertBbox4326to3857(respEncodeItem.bbox);
      const newEncodeItems = [...encodeItems, respEncodeItem];

      dispatchEncodeItems({
        type: "CACHING_ENCODED",
        payload: newEncodeItems,
      });

      dispatchActiveEncodeImageItem({
        type: "SET_ACTIVE_ENCODE_IMAGE",
        payload: respEncodeItem,
      });
    } catch (error) {
      reset();
    }
    reset();
  };

  const requestAOI = async () => {
    const requestProps = getPropertiesRequest(map, pointsSelector);
    requestSAMAOI(requestProps);
  };

  return (
    <>
      <button
        className="custom_button bg-orange-ds text-white hover:bg-orange-ds hover:bg-opacity-80"
        onClick={() => requestAOI()}
      >
        New SAM AOI
      </button>
    </>
  );
};
