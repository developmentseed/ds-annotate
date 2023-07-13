import React, { useContext, useState } from "react";
import { MainContext } from "../contexts/MainContext";
import { EncodeItem } from "./EncodeItem";
import { SegmentAM } from "./SegmentAM";
import { MenuTemplate } from "./MenuTemplate";

export const Badge = () => {
  const { activeEncodeImageItem } = useContext(MainContext);
  return (
    <span className="inline-flex text-xxs bg-blue-400 justify-center items-center font-medium text-slate-900 bg-gray-200 rounded pr-1 pl-1">
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
        <div className="mx-auto pr-2 pl-2">
          <SegmentAM />
        </div>
      </>
    </MenuTemplate>
  );
};
