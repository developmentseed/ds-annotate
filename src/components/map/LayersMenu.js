import { useEffect, useContext } from 'react';
import { BsTrash } from 'react-icons/bs';
import { MainContext } from './../../contexts/MainContext';

const LayersMenu = () => {
    const {
        displayExtraLayers,
        dispatchDisplayExtraLayers

      } = useContext(MainContext);

  const hideLayers = () => {
    dispatchDisplayExtraLayers({
        type: 'DISPLAY_EXTRA_LAYERS',
        payload: !displayExtraLayers,
      });
  };
  return (
    <div
      className="inline-flex justify-center items-center pr-2 pl-2 ml-3 text-sm font-medium rounded-full"
      onClick={() => {
        hideLayers();
      }}
    >
      <BsTrash
        className="fill-current w-3 h-3 mr-2 cursor-pointer"
        title="Delete item"
      ></BsTrash>
      <span>{'hide'}</span>
    </div>
  );
};

export default LayersMenu;
