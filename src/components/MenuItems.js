import { useContext } from "react";
import { BsViewList } from "react-icons/bs";

import { MainContext } from "./../contexts/MainContext";
import Item from "./Item";

export const MenuItems = () => {
  const { items } = useContext(MainContext);
  return (
    <div>
      <div className="menuHeader">
        <BsViewList></BsViewList>
        <span className="text-sm text-base font-small flex-1 duration-200 false">
          Drawn items
        </span>
      </div>

      <div className="max-h-[150px] scroll-smooth hover:scroll-auto overflow-auto overscroll-y-contain">
        {items.map((item, index) => {
          return <Item key={index} item={item}></Item>;
        })}
      </div>
    </div>
  );
};
