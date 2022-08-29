import React, { useContext, useCallback } from 'react';
import { MainContext } from '../contexts/MainContext';
import { BsDownload } from 'react-icons/bs';
import { BsViewList } from 'react-icons/bs';
import { union_polygons } from '../utils/transformation';
import { getGeojson, getItems } from '../utils/featureCollection';

export const MenuActions = () => {
  const { items, dispatchSetItems } = useContext(MainContext);

  const setItems = useCallback(
    (items) => {
      dispatchSetItems({
        type: 'SET_ITEMS',
        payload: items,
      });
    },
    [dispatchSetItems]
  );

  const merge_polygons = () => {
    const fc = getGeojson(items);
    const mergedFeatures = union_polygons(fc.features);
    const mergedItems = getItems(mergedFeatures);
    setItems(mergedItems);
  };

  return (
    <div>
      <div className="menuHeader">
        <BsViewList></BsViewList>
        <span className=" text-base font-medium flex-1 duration-200 false">
          Polygon Action
        </span>
      </div>

      <div className="flex flex-row mt-3">
        <button
          className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-2 border border-blue-500 hover:border-transparent rounded"
          onClick={() => {
            merge_polygons();
          }}
        >
          Merge (M)
        </button>
      </div>
    </div>
  );
};
