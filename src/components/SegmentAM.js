import React, { useContext, useState } from "react";
import { MainContext } from "../contexts/MainContext";
import { MapContext } from "../contexts/MapContext";
import { getCanvas } from "../utils/canvas";
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


  const requestPrediction = () => {
    setSamApiStatus("Predicting...")
    const fcPoints = olFeatures2geojson(pointsSelector);
    const coords = fcPoints.features.map(f => [f.properties.px, f.properties.py])
    console.log(coords)
    //Enable loading
    setLoading(true);
    const requestProps = {
      "image_embeddings": null,
      "image_shape": map.getSize(),
      "input_label": 1, //TODO pass the rigth class in context
      "input_point": coords[0] //TODO Pass all coordinates
    }
    console.log(requestProps)
    getPrediction(getCanvas(map), requestProps).then(response => {
      console.log("image_embedding");
      console.log(JSON.stringify(response.image_embedding));
      console.log("masks")
      console.log(JSON.stringify(response.masks));
      reset();
    }).catch(error => {
      reset();
    });
  };

  return (

    <div className="absolute bottom-1 left-2 booto z-50">
      <button
        type="button"
        className={`bg-${samApiStatus ? "yellow" : "blue"}-500 hover:bg-${samApiStatus ? "yellow" : "blue"}-600 text-white font-bold py-1 px-2 rounded`}
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
