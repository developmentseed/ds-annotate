import React from 'react';
import { useEffect, useContext, useState } from 'react';
import { MapContext } from '../../contexts/MapContext';
import { MainContext } from '../../contexts/MainContext';

export const Viewer = ({ viewerScale, setViewerScale }) => {
  const { map } = useContext(MapContext);
  const { activeProject } = useContext(MainContext);
  const [scale, setScale] = useState();
  useEffect(() => {
    if (!map) return;
    map.on('moveend', function (e) {
      const scale_ = document.getElementsByClassName('ol-scale-line-inner')[0]
        .innerText;
      setScale(scale_);
    });
  }, [map, activeProject]);

  const addViewer = (size) => {
    const mapWidth = document.getElementById('map').clientWidth;
    const mapHeight = document.getElementById('map').clientHeight;
    setViewerScale({ h: mapHeight + size, w: mapWidth + size });
  };

  return (
    <div className="fixed top-3 right-3 bg-[rgba(255,255,255,0.4)] p-[3px] text-center rounded-sm ">
      <div className="flex flex-row">
        <button
          className="w-6 h-6 p-3 pl-4 pr-4 bg-[rgba(0,60,136,0.5)] text-white items-center justify-center text-center font-bold text-1xl leading-normal uppercase rounded-sm shadow-md hover:bg-[rgba(0,60,136,0.5)] hover:shadow-lg focus:bg-[rgba(0,60,136,0.5)] focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex mr-[1px]"
          title="Load data on JOSM"
          onClick={() => {
            addViewer(100);
          }}
        >
          {'+'}
        </button>
        <button
          type="button"
          className="w-6 h-6 p-3 pl-4 pr-4 bg-[rgba(0,60,136,0.5)] text-white items-center justify-center text-center font-bold text-1xl leading-normal uppercase rounded-sm shadow-md hover:bg-[rgba(0,60,136,0.5)] hover:shadow-lg focus:bg-[rgba(0,60,136,0.5)] focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex "
          title="Download data as GeoJSON"
          onClick={() => {
            addViewer(-100);
          }}
        >
          {'-'}
        </button>
      </div>
      <div className="text-white font-medium text-[10px] ">{`${viewerScale.w}x${viewerScale.h}`}</div>
      <div className="text-white font-medium text-[10px] ">{scale}</div>
    </div>
  );
};
