import React, { useContext } from "react";
import { MainContext } from "../contexts/MainContext";
import { BsDownload } from "react-icons/bs";

import { downloadGeojsonFile, downloadInJOSM } from "../utils/utils";
import { olFeatures2geojson } from "./../utils/featureCollection";

export const DownloadData = ({ classProps }) => {
  const { items, activeProject } = useContext(MainContext);

  const downloadGeojson = () => {
    const geojson = JSON.stringify(olFeatures2geojson(items));
    const fileName = `${activeProject.properties.name.replace(
      /\s/g,
      "_"
    )}.geojson`;
    downloadGeojsonFile(geojson, fileName);
  };

  const josm = () => {
    const geojson = JSON.stringify(olFeatures2geojson(items));
    downloadInJOSM(geojson, activeProject);
  };

  return (

    <div className="container mx-auto flex flex-wrap justify-center gap-1">
      <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center mb-2 w-full sm:w-auto"
        type="button"
        title="Load data on JOSM"
        onClick={() => {
          josm();
        }}
      >
        <i className="fas fa-heart"><BsDownload className="w-3 mt-1 mr-2"></BsDownload></i>
        JOSM
      </button>
      <button
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center mb-2 w-full sm:w-auto"
        type="button"
        onClick={() => {
          downloadGeojson();
        }}
        title="Download data as GeoJSON"
      >
        <i className="fas fa-heart"><BsDownload className="w-3 mt-1 mr-2"></BsDownload></i>
        GeoJson
      </button>
    </div>
  );
};
