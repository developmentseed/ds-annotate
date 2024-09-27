import React, { useContext } from "react";
import { MainContext } from "../contexts/MainContext";
import { downloadInJOSM } from "../utils/requests";
import { downloadGeojsonFile, guid } from "../utils/utils";
import { olFeatures2geojson } from "../utils/convert";
import { BsDownload, BsUpload } from "react-icons/bs";

export const MenuExpData = () => {
  const { items, activeProject, activeEncodeImageItem } =
    useContext(MainContext);

  const downloadGeojson = () => {
    const geojson = JSON.stringify(olFeatures2geojson(items));
    const projectName = activeProject.properties.name.replace(/\s/g, "_");
    downloadGeojsonFile(geojson, `${projectName}.geojson`);
  };

  const josm = () => {
    const geojson = JSON.stringify(olFeatures2geojson(items));
    let aoiId = guid();
    if (activeEncodeImageItem) {
      aoiId = activeEncodeImageItem.id;
    }
    downloadInJOSM(geojson, activeProject, aoiId);
  };

  return (
    <div className="grid grid-cols-2 gap-2 mt-6">
      <button
        className="custom_button"
        onClick={() => downloadGeojson()}
        title="Download data as GeoJSON"
      >
        <div className="text-center">
          <BsDownload className="mr-2 inline" />
          GeoJSON
        </div>
      </button>
      <button className="custom_button" onClick={() => josm()}>
        <div className="text-center">
          <BsUpload className="mr-2 inline" />
          JOSM
        </div>
      </button>
    </div>
  );
};
