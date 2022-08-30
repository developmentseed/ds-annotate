import React, { useContext } from 'react';
import { MainContext } from '../contexts/MainContext';
import { BsDownload } from 'react-icons/bs';

import { downloadGeojsonFile, downloadInJOSM } from '../utils/utils';
import { getGeojson } from './../utils/featureCollection';

export const DownloadData = ({ classProps }) => {
  const { items, activeProject } = useContext(MainContext);

  const downloadGeojson = () => {
    const geojson = JSON.stringify(getGeojson(items));
    const fileName = `${activeProject.properties.name.replace(
      /\s/g,
      '_'
    )}.geojson`;
    downloadGeojsonFile(geojson, fileName);
  };

  const josm = () => {
    const geojson = JSON.stringify(getGeojson(items));
    downloadInJOSM(geojson, activeProject);
  };

  return (
    <div className="flex flex-row mt-3">
      <button
        type="button"
        className="custom_button_2 mr-1"
        title="Load data on JOSM"
        onClick={() => {
          josm();
        }}
      >
        <BsDownload className="w-3 mt-1 mr-2"></BsDownload>
        JOSM
      </button>
      <button
        type="button"
        className="custom_button_2"
        onClick={() => {
          downloadGeojson();
        }}
        title="Download data as GeoJSON"
      >
        <BsDownload className="w-3 mt-1 mr-2"></BsDownload>
        GeoJson
      </button>
    </div>
  );
};
