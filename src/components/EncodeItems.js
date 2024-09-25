import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../contexts/MainContext";
import { EncodeItem } from "./EncodeItem";
import { EncodeCanvas } from "./EncodeCanvas";
import { MenuTemplate } from "./MenuTemplate";
import { EncodeExpImp } from "./EncodeExpImp";
import { openDatabase, storeEncodeItems } from "../store/indexedDB";
import { fetchListURLS, requestEncodeImages } from "../utils/requests";
import { getFileNameFromURL } from "../utils/utils";
import { sam2Geojson, features2olFeatures, setProps2Features, saveFeaturesToGeoJSONFile, convertBbox4326to3857 } from "../utils/convert";

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

        console.log(activeProject)
        const encodeImages = await requestEncodeImages(activeProject.properties.slug)
        console.log(encodeImages)

        let encodedImagesArray = Object.values(encodeImages.detection).map(encodeI => {
          encodeI.bbox = convertBbox4326to3857(encodeI.bbox);
          return encodeI;
        });

        console.log('%csrc/components/EncodeItems.js:47 encodedImagesArray', 'color: #007acc;', encodedImagesArray);
        //List encode images from indexDB
        // await openDatabase();
        // let listEncodeItems = await storeEncodeItems.getDataByProject(
        //   activeProject.properties.name
        // );
        // const existingEIid = listEncodeItems.map((e) => e.id);
        // let listEncodeItemsFromurl = [];

        // // Check if the project has encodeImages, and request if it has encode URLs that do not exist in the IndexedDB
        // if (activeProject.properties.encodeImages) {
        //   const urls = activeProject.properties.encodeImages.filter((url) => {
        //     const id = getFileNameFromURL(url);
        //     if (!existingEIid.includes(id)) return true;
        //     return false;
        //   });
        //   listEncodeItemsFromurl = await fetchListURLS(urls);
        //   listEncodeItems = listEncodeItems.concat(listEncodeItemsFromurl);
        // }

        dispatchEncodeItems({
          type: "CACHING_ENCODED",
          payload: encodedImagesArray,
        });

        // // Store request encode images in IndexedDB
        // listEncodeItemsFromurl.forEach((ei) => {
        //   console.log("%cEncodeItems.js line:59 ei", "color: #007acc;", ei);
        //   storeEncodeItems.addData(ei);
        // });
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
