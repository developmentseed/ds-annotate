import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../contexts/MainContext";
import { EncodeItem } from "./EncodeItem";
import { EncodeCanvas } from "./EncodeCanvas";
import { MenuTemplate } from "./MenuTemplate";
import { EncodeExpImp } from "./EncodeExpImp";
import { fetchListURLS, requestEncodeImages } from "../utils/requests";
import {  convertBbox4326to3857 } from "../utils/convert";

import { BsLayoutWtf } from "react-icons/bs";

export const Badge = () => {
  const { activeEncodeImageItem } = useContext(MainContext);
  return (
    <span className="inline-flex justify-center bg-green-400 items-center px-0 ml-1 text-xs font-medium text-slate-800 bg-gray-200 rounded pt-0 pr-1 pl-1">
      {activeEncodeImageItem
        ? `z${Math.round(activeEncodeImageItem.zoom)}`
        : ""}
    </span>
  );
};

export const EncodeItems = () => {
  const { encodeItems, dispatchEncodeItems, activeProject } =
    useContext(MainContext);
  const [openMenu, setOpenMenu] = useState(true);

  // Load indexedDB for encode Items
  useEffect(() => {
    if (!activeProject) return;
    const fetchData = async () => {
      try {
        const encodeImages = await requestEncodeImages(activeProject.properties.slug);
        let encodedImagesArray = Object.values(encodeImages.detection).map(encodeI => {
          encodeI.bbox = convertBbox4326to3857(encodeI.bbox);
          return encodeI;
        });

        dispatchEncodeItems({
          type: "CACHING_ENCODED",
          payload: encodedImagesArray,
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
    setOpenMenu(true);
  }, [activeProject]);

  return (
    <MenuTemplate
      title={"SAM AOIs"}
      badge={<Badge />}
      icon={<BsLayoutWtf />}
      openMenu={openMenu}
      setOpenMenu={setOpenMenu}
    >
      <>
        <div className="max-h-[230px] scroll-smooth hover:scroll-auto overflow-auto overscroll-y-contain my-2 justify-center items-center ml-2">
          {encodeItems.map((encodeItem, index) => (
            <EncodeItem key={index} encodeItem={encodeItem} />
          ))}
          {!encodeItems?.length && (
            <p className="text-sm text-center text-slate-500 my-1">
              No AOI is available yet
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 gap-2">
          <EncodeCanvas />
        </div>
      </>
    </MenuTemplate>
  );
};
