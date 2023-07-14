import { useContext, useEffect, useLayoutEffect, useRef } from "react";
import { MainContext } from "../contexts/MainContext";
import Item from "./Item";
import { openDatabase, storeItems } from "../store/indexedDB";
import { features2olFeatures } from "../utils/convert";
import { MenuTemplate } from "./MenuTemplate";
import React from "react";
import { ItemsDataActions } from "./ItemsDataActions";

export const Items = () => {
  const { items, dispatchSetItems, activeProject } = useContext(MainContext);
  const scrollDivRef = useRef(null);

  // Load items data from DB
  useLayoutEffect(() => {
    if (!activeProject) return;
    const fetchData = async () => {
      try {
        await openDatabase();
        const items_ = await storeItems.getDataByProject(
          activeProject.properties.name
        );
        const filterItems_ = items_.filter(
          (item) => item.geometry.coordinates.length > 0
        );
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
  }, [activeProject]);

  useEffect(() => {
    if (scrollDivRef.current) {
      const scrollDiv = scrollDivRef.current;
      scrollDiv.scrollTop = scrollDiv.scrollHeight;
    }
  }, [items]);
  return (
    <MenuTemplate title={"Drawn items"} badge={""}>
      <div
        ref={scrollDivRef}
        className="max-h-[150px] scroll-smooth hover:scroll-auto overflow-auto overscroll-y-contain"
      >
        {items.map((item, index) => {
          return <Item key={index} index={index + 1} item={item}></Item>;
        })}
      </div>
      <div className="grid">
        <ItemsDataActions />
      </div>
    </MenuTemplate>
  );
};
