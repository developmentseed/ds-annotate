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
    <div className="flex justify-center gap-2">
      <button className="custom_button" onClick={() => {
        downloadGeojson();
      }}>Download as geojson</button>
      <button className="custom_button" onClick={() => {
        josm();
      }}>Download in JOSM</button>
    </div>
  );
};
