import React, { useContext, useState } from "react";
import { MainContext } from "../contexts/MainContext";
import { MapContext } from "../contexts/MapContext";
import { getCanvasForLayer } from "../utils/canvas";
import { getPrediction } from "../utils/samApi";
import { olFeatures2geojson, samToGeojson, features2olFeatures } from "../utils/featureCollection";
import { downloadGeojsonFile } from '../utils/utils'
import resp from '../utils/resp'
export const SegmentAM = ({ setLoading }) => {
  const {
    pointsSelector,
    activeProject,
    activeClass,
    dispatchSetItems
  } = useContext(MainContext);


  const { map } = useContext(MapContext);
  const [samApiStatus, setSamApiStatus] = useState(null);
  const reset = () => {
    setLoading(false);
    setSamApiStatus(null)
  }

  async function requestPrediction() {
    setSamApiStatus("Predicting...")
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
      "input_label": 1, //TODO pass the rigth class in context
      "input_point": coords[0], //TODO Pass all coordinates
      "crs": crs,
      "bbox": extent
    }

    // reset();
    // const features =samToGeojson(resp, activeProject, activeClass );
    // const items = features2olFeatures(features)
    // dispatchSetItems({
    //   type: "SET_ITEMS",
    //   payload: items,
    // });

    const canvas = await getCanvasForLayer(map, "main_layer");
    getPrediction(canvas, requestProps).then(response => {
      // console.log(response)
      const features = samToGeojson(response.masks.geojsons, activeProject, activeClass);
      downloadGeojsonFile(JSON.stringify(features),"adc.json")
      const items = features2olFeatures(features)
      dispatchSetItems({
        type: "SET_ITEMS",
        payload: items,
      });
      reset();
    }).catch(error => {
      console.log(error)
      reset();
    });


  };

  return (

    <div className="absolute bottom-1 left-2 booto z-50">
      <button
        type="button"
        className={`bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded`}
        title="Use SAM"
        onClick={() => {
          requestPrediction();
        }}
      // disabled={samApiStatus || false}
      >
        {samApiStatus || "Predict Segments"}
      </button>
    </div>
  );
};
