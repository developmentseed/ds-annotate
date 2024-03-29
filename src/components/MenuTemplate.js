import React from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";

export const MenuTemplate = ({
  title,
  badge,
  icon,
  openMenu,
  setOpenMenu,
  children,
}) => {
  return (
    <>
      <div className="menuHeader" onClick={() => setOpenMenu(!openMenu)}>
        {icon}
        <span className="text-sm font-semibold flex-1 duration-200 false text-ellipsis truncate">
          {title}
        </span>
        {badge}
        {openMenu ? <BsChevronUp /> : <BsChevronDown />}
      </div>
      {openMenu && <div>{children}</div>}
    </>
  );
};
