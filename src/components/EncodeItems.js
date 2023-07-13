import React, { useContext, useState } from "react";
import { MainContext } from "../contexts/MainContext";
import { EncodeItem } from "./EncodeItem";
import { SegmentAM } from "./SegmentAM";
import { MenuTemplate } from "./MenuTemplate";
export const EncodeItems = () => {
  const { encodeItems } = useContext(MainContext);
  return (
    <MenuTemplate title={"Encode Areas"} badge={""}>
      <>
        {" "}
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
