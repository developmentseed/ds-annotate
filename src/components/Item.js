import {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useContext,
} from 'react';

import { BsTrash, BsEyeFill } from 'react-icons/bs';
import { MainContext } from './../contexts/MainContext';

const Item = ({ item, index }) => {
  const {
    items,
    dispatchSetItems,
    highlightedItem,
    dispatchSetHighlightedItem,
  } = useContext(MainContext);

  const deleteItem = (item) => {
    const newItems = items.filter((i) => i.ol_uid !== item.ol_uid);
    dispatchSetItems({
      type: 'SET_ITEMS',
      payload: newItems,
    });
  };

  const zoomToItem = (item) => {
    dispatchSetHighlightedItem({
      type: 'SET_HIGHLIGHTED_ITEM',
      payload: item,
    });
  };

  return (
    <div
      className="inline-flex justify-center items-center pr-2 pl-2 ml-3 text-sm font-medium rounded-full cursor-pointer"
      style={{ background: `${item.values_.color}` }}
      onMouseEnter={() => {
        zoomToItem(item);
      }}
      onMouseLeave={() => {
        zoomToItem(null);
      }}
    >
      <BsTrash
        className="fill-current w-3 h-3 mr-2 cursor-not-allowed"
        onClick={() => {
          deleteItem(item);
        }}
      ></BsTrash>
      <span
      // onClick={() => {
      //   zoomToItem(item);
      // }}
      >
        {item.ol_uid}
      </span>
    </div>
  );
};

export default Item;
