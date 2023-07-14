import React, { useContext } from "react";
import { MainContext } from "../contexts/MainContext";
import { downloadInJOSM } from "../utils/requests";
import { downloadGeojsonFile } from "../utils/utils";
import { olFeatures2geojson } from "../utils/convert";

export const MenuExpData = () => {
  const { items, activeProject } = useContext(MainContext);

  const downloadGeojson = () => {
    const geojson = JSON.stringify(olFeatures2geojson(items));
    const projectName = activeProject.properties.name.replace(/\s/g, "_");
    downloadGeojsonFile(geojson, `${projectName}.geojson`);
  };

  const josm = () => {
    const geojson = JSON.stringify(olFeatures2geojson(items));
    downloadInJOSM(geojson, activeProject);
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <button className="custom_button" onClick={() => downloadGeojson()}>
        Exp GeoJSON
      </button>
      <button className="custom_button" onClick={() => josm()}>
        Exp to JOSM
      </button>
    </div>
  );
};
