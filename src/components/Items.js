import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { MainContext } from "../contexts/MainContext";
import Item from "./Item";
import { openDatabase, storeItems } from "../store/indexedDB";
import { features2olFeatures } from "../utils/convert";
import { MenuTemplate } from "./MenuTemplate";
import React from "react";
import { ItemsDataActions } from "./ItemsDataActions";
import { BsBoundingBoxCircles } from "react-icons/bs";

export const Items = () => {
  const { items, dispatchSetItems, activeProject } = useContext(MainContext);
  const scrollDivRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(true);

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
    setOpenMenu(true);
  }, [activeProject]);

  useEffect(() => {
    if (scrollDivRef.current) {
      const scrollDiv = scrollDivRef.current;
      scrollDiv.scrollTop = scrollDiv.scrollHeight;
    }
  }, [items]);
  return (
    <MenuTemplate
      title={"Drawn Items"}
      icon={<BsBoundingBoxCircles />}
      openMenu={openMenu}
      setOpenMenu={setOpenMenu}
    >
      <div
        ref={scrollDivRef}
        className="max-h-[150px] scroll-smooth hover:scroll-auto overflow-auto overscroll-y-contain"
      >
        {items.map((item, index) => {
          return <Item key={index} index={item.id_} item={item}></Item>;
        })}
      </div>
      <div className="grid">
        <ItemsDataActions />
      </div>
    </MenuTemplate>
  );
};
