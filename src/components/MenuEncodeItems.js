import React, { useContext, useState } from "react";
import { MainContext } from "../contexts/MainContext";
import { EncodeItem } from "./EncodeItem";
import { BsChevronDown, BsViewList } from "react-icons/bs";
import { SegmentAM } from "./SegmentAM";
export const MenuEncodeItems = () => {
  const { encodeItems } = useContext(MainContext);
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <>
      <div
        className="menuHeader"
        onClick={() => {
          setOpenMenu(!openMenu);
        }}
      >
        <BsViewList></BsViewList>
        <span className="text-sm text-base font-small flex-1 duration-200 false">
          Encode Areas
        </span>
        <BsChevronDown></BsChevronDown>
      </div>
      {openMenu ? (
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
      ) : (
        ""
      )}
    </>
  );
};
