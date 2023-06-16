import { useContext, useEffect, useState } from "react";
import { MainContext } from "../contexts/MainContext";
import { EncodeItem } from "./EncodeItem";
export const MenuEncodeItems = () => {
  const { encodeItems, dispatchEncodeItems } = useContext(MainContext);
  return (
    <div className="mt-8">
      <div
        className="absolute bg-white bg-opacity-50 p-1 right-0 top-0 bottom-20px scroll-smooth hover:scroll-auto overflow-auto overscroll-y-contain"
        style={{ maxHeight: "100%", height: "100%" }}
      >
        <div className="w-100">
          {encodeItems.map((encodeItem, index) => (
            <EncodeItem key={index} encodeItem={encodeItem} />
          ))}
        </div>
      </div>
    </div>
  );
};
