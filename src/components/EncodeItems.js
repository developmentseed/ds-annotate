import React, { useContext, useState } from "react";
import { MainContext } from "../contexts/MainContext";
import { EncodeItem } from "./EncodeItem";
import { EncodeCanvas } from "./EncodeCanvas";
import { MenuTemplate } from "./MenuTemplate";
import { EncodeExpImp } from "./EncodeExpImp";

export const Badge = () => {
  const { activeEncodeImageItem } = useContext(MainContext);
  return (
    <span className="inline-flex justify-center bg-blue-400 items-center px-0 ml-1 text-xs font-medium text-slate-800 bg-gray-200 rounded pt-0 pr-1 pl-1">
      {activeEncodeImageItem
        ? `Active-z${Math.round(activeEncodeImageItem.zoom)}`
        : ""}
    </span>
  );
};

export const EncodeItems = () => {
  const { encodeItems } = useContext(MainContext);
  return (
    <MenuTemplate title={"Encode Areas"} badge={<Badge />}>
      <>
        <div className="max-h-[230px] scroll-smooth hover:scroll-auto overflow-auto overscroll-y-contain">
          {encodeItems.map((encodeItem, index) => (
            <EncodeItem key={index} encodeItem={encodeItem} />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <EncodeExpImp />
          <EncodeCanvas />
        </div>
      </>
    </MenuTemplate>
  );
};
