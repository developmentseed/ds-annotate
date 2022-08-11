import {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useContext,
} from 'react';
import { BsViewList } from 'react-icons/bs';
import { MainContext } from './../contexts/MainContext';
import Item from './Item';

export const MenuItems = () => {
  const { items } = useContext(MainContext);

  return (
    <div className="pt-2 mt-2 space-y-2 border-t border-gray-200">
      <div className="menuHeader">
        <BsViewList></BsViewList>
        <span className=" text-base font-medium flex-1 duration-200 false">
          {'Drawed items'}
        </span>
      </div>

      {items.map((item, index) => {
        return <Item  key={index} item={item}></Item>
      })}
    </div>
  );
};

