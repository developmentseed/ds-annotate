import React, { useState } from "react";
import { BsChevronDown, BsViewList } from "react-icons/bs";

export const MenuTemplate = ({ title, badge, children }) => {
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <div>
      <div
        className="menuHeader"
        onClick={() => {
          setOpenMenu(!openMenu);
        }}
      >
        <BsViewList></BsViewList>
        <span className="text-sm text-base font-small flex-1 duration-200 false">
          {title}
        </span>
        {badge}
        <BsChevronDown></BsChevronDown>
      </div>
      {openMenu && <div>{children}</div>}
    </div>
  );
};
