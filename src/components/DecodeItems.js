import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../contexts/MainContext";
import { EncodeItem } from "./EncodeItem";
import { EncodeCanvas } from "./EncodeCanvas";
import { MenuTemplate } from "./MenuTemplate";
import { EncodeExpImp } from "./EncodeExpImp";
import { openDatabase, storeEncodeItems } from "../store/indexedDB";
import { fetchListURLS } from "../utils/requests";
import { getFileNameFromURL } from "../utils/utils";
import { BsLayoutWtf } from "react-icons/bs";
import { DecodeType } from "./DecodeType";
import { Decode } from "./Decode";

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

export const DecodeItems = () => {
  const { encodeItems, dispatchEncodeItems, activeProject } =
    useContext(MainContext);
  const [openMenu, setOpenMenu] = useState(true);

  return (
    <MenuTemplate
      title={"Prompts"}
      badge={<Badge />}
      icon={<BsLayoutWtf />}
      openMenu={openMenu}
      setOpenMenu={setOpenMenu}
    >
      <Decode />
    </MenuTemplate>
  );
};
