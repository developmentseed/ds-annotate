import React from 'react';
import { BsViewList } from 'react-icons/bs';
export const MenuItems = () => {
  return (
    <div className='pt-2 mt-2 space-y-2 border-t border-gray-200'>
      <div className="menuHeader">
        <BsViewList></BsViewList>
        <span className=" text-base font-medium flex-1 duration-200 false">
          {'Drawed items'}
        </span>
      </div>
    </div>
  );
};
