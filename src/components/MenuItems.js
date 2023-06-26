import { useContext, useEffect, useLayoutEffect } from "react";
import { BsViewList } from "react-icons/bs";

import { MainContext } from "./../contexts/MainContext";
import Item from "./Item";
import { openDatabase, storeItems } from "./../store/indexedDB";
import { features2olFeatures } from "./../utils/convert";

export const MenuItems = () => {
  const { items, dispatchSetItems } = useContext(MainContext);

  // Load items data from DB
  useLayoutEffect(() => {
    const fetchData = async () => {
      try {
        await openDatabase();
        const items_ = await storeItems.getAllData();
        const filterItems_ = items_.filter((item) => {
          if (item.geometry.coordinates.length > 0) {
            return item;
          }
        });
        const olFeatures = features2olFeatures(filterItems_);
        dispatchSetItems({
          type: "SET_ITEMS",
          payload: olFeatures,
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

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
