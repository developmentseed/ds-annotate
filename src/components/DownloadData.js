import React from 'react';
import { useContext} from 'react';
import { MainContext } from '../contexts/MainContext';
import { BsDownload } from 'react-icons/bs';

import { downloadGeojsonFile, downloadInJOSM } from './../utils/download';
import { getGeojson } from './../utils/featureCollection';

export const DownloadData = ({ classProps }) => {
  const { items, activeProject } = useContext(MainContext);

  const downloadGeojson = () => {
    const geojson = getGeojson(items);
    const fileName = `${activeProject.properties.name.replace(
      /\s/g,
      '_'
    )}.geojson`;
    downloadGeojsonFile(geojson, fileName);
  };

  const josm = (items) => {
    var geojson = getGeojson(items);
    downloadInJOSM(geojson, activeProject);
  };

  return (
    <div className="flex flex-row mt-3">
      <button
        type="button"
        className="px-6 pt-2.5 pb-1 bg-blue-600 text-white font-medium text-xs leading-normal uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex mr-1"
      >
        <BsDownload className="w-3 mr-2"></BsDownload>
        JOSM
      </button>
      <button
        type="button"
        className="px-6 pt-2.5 pb-1 bg-blue-600 text-white font-medium text-xs leading-normal uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex "
        onClick={() => {
          downloadGeojson();
        }}
      >
        <BsDownload
          className="w-3 mr-2"
          onClick={() => {
            josm();
          }}
        ></BsDownload>
        GeoJson
      </button>
    </div>
  );
};
