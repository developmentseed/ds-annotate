import {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useContext,
} from 'react';

import { BsTrash } from 'react-icons/bs';
import { MainContext } from './../contexts/MainContext';

const Item = ({ item, index }) => {
  const { items, dispatchSetItems } = useContext(MainContext);
console.log(item)
  const deleteItem = (item) => {
    const newItems = items.filter((i) => i.ol_uid !== item.ol_uid);
    dispatchSetItems({
        type: 'SET_ITEMS',
        payload: newItems,
      });
  };
  return (
    <div className="inline-flex justify-center items-center pr-2 pl-2 ml-3 text-sm font-medium rounded-full" style={{background:`${item.values_.color}`}}>
      <BsTrash
        className="fill-current w-3 h-3 mr-2 cursor-pointer"
        onClick={() => {
          deleteItem(item);
        }}
      ></BsTrash>
      {item.ol_uid}
    </div>
  );
};

export default Item;
