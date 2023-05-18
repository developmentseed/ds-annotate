import React, { useContext, useState } from "react";
import { MainContext } from "../contexts/MainContext";
import { MapContext } from "../contexts/MapContext";
import { getCanvasForLayer } from "../utils/canvas";
import { getPrediction } from "../utils/samApi";
import { olFeatures2geojson } from "../utils/featureCollection";

export const SegmentAM = ({ setLoading }) => {
  const {
    pointsSelector
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
    console.log(coords)
    //Enable loading
    setLoading(true);
    const [imgWidth, imgHeight] = map.getSize()
    const requestProps = {
      "image_embeddings": null,
      "image_shape": [imgWidth, imgHeight],
      "input_label": 1, //TODO pass the rigth class in context
      "input_point": coords[0] //TODO Pass all coordinates
    }
    const canvas = await getCanvasForLayer(map, "main_layer");
    getPrediction(canvas, requestProps).then(response => {
      console.log(JSON.stringify({ canvas: `data:image/jpeg;base64,${canvas}`, masks: response.masks, image_embedding: response.image_embedding, requestProps: requestProps }));
      reset();
    }).catch(error => {
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
      disabled={samApiStatus || false}
      >
        {samApiStatus || "Predict Segments"}
      </button>
    </div>
  );
};
