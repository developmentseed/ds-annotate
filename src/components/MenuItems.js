import { useContext, useEffect } from "react";
import { BsViewList } from "react-icons/bs";

import { MainContext } from "./../contexts/MainContext";
import Item from "./Item";
import { startDB, getAllData } from "./../store/indexedDB";
import { features2olFeatures } from "./../utils/convert";

export const MenuItems = () => {
  const { items, dispatchSetItems } = useContext(MainContext);

  // Load items data from DB
  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = await startDB();
        const items_ = await getAllData(db, "items");
        const olFeatures = features2olFeatures(items_);
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
