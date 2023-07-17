import React, { useState } from "react";
import { BsChevronDown, BsChevronUp, BsViewList } from "react-icons/bs";

export const MenuTemplate = ({ title, badge, icon, children }) => {
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <div>
      <div
        className="menuHeader"
        onClick={() => {
          setOpenMenu(!openMenu);
        }}
      >
        {icon}
        <span className="text-sm text-base font-small flex-1 duration-200 false">
          {title}
        </span>
        {badge}
        {openMenu ? <BsChevronUp /> : <BsChevronDown />}
      </div>
      {openMenu && <div>{children}</div>}
    </div>
  );
};
