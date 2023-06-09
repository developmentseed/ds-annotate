import React, { useContext, useState } from "react";
import { MainContext } from "../contexts/MainContext";
import { MapContext } from "../contexts/MapContext";
import { getCanvasForLayer } from "../utils/canvas";
import { getPrediction } from "../utils/samApi";
import { olFeatures2geojson, sam2Geojson, features2olFeatures } from "../utils/featureCollection";
import { downloadGeojsonFile } from '../utils/utils'
// import resp from '../static/resp_array.json'

export const SegmentAM = ({ setLoading }) => {
  const {
    pointsSelector,
    activeProject,
    activeClass,
    dispatchSetItems,
    items
  } = useContext(MainContext);


  const { map } = useContext(MapContext);
  const [samApiStatus, setSamApiStatus] = useState(null);
  const reset = () => {
    setLoading(false);
    setSamApiStatus(null)
  }

  async function requestPrediction() {
    setSamApiStatus("Predicting ...")
    const fcPoints = olFeatures2geojson(pointsSelector);
    const coords = fcPoints.features.map(f => [f.properties.px, f.properties.py])
    //Enable loading
    setLoading(true);
    const [imgWidth, imgHeight] = map.getSize()

    // Get the view CRS and extent
    const view = map.getView();
    const projection = view.getProjection();
    const crs = projection.getCode();
    const extent = view.calculateExtent(map.getSize());
    const requestProps = {
      "image_shape": [imgWidth, imgHeight],
      "input_label": 1,
      "input_point": coords[0],
      "crs": crs,
      "bbox": extent
    }

    const canvasBase64 = await getCanvasForLayer(map, "main_layer");
    getPrediction(canvasBase64, requestProps).then(response => {
      if (response && response.masks && response.masks.geojsons) {
        const features = sam2Geojson(response.masks.geojsons, activeProject, activeClass);
        // downloadGeojsonFile(JSON.stringify(features), "adc.json")
        const sam_items = features2olFeatures(features)
        dispatchSetItems({
          type: "SET_ITEMS",
          payload: [...items,...sam_items],
        });
      }
      reset();
    }).catch(error => {
      reset();
    });
  };

  return (
    <div className="absolute bottom-1 left-2 z-50">
      <button
        type="button"
        className="custom_button bg-red-500 text-white"
        onClick={() => {
          requestPrediction();
        }}
      // disabled={samApiStatus || false}
      >
        {samApiStatus || "Segment Anything"}
      </button>
    </div>
  );
};
