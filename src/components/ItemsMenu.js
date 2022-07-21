import React from 'react';
import { BsViewList } from 'react-icons/bs';
export const ItemsMenu = () => {
  return (
    <div>
      <div className="menuHeader">
        <BsViewList></BsViewList>
        <span className=" text-base font-medium flex-1 duration-200 false">
          {'Drawed items'}
        </span>
      </div>
    </div>
  );
};
