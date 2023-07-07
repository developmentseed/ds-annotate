import React, { useContext, useState, useEffect } from "react";
import { MainContext } from "../contexts/MainContext";
import { BsViewList, BsChevronDown } from "react-icons/bs";
import { ClassObj } from "./ClassObj";

import { getClassLayers } from "../utils/convert";

export const MenuClass = () => {
  const { activeProject, activeClass } = useContext(MainContext);
  const [classes, setClasses] = useState([]);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    const classLayers = getClassLayers(activeProject);
    setClasses(classLayers);
    setOpenMenu(true);
  }, [activeProject]);

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
          Classes
        </span>
        <span
          className="inline-flex justify-center items-center px-2 ml-3 text-xs font-medium text-slate-800 bg-gray-200 rounded-full pr-4 pl-4"
          style={{ background: `${activeClass ? activeClass.color : ""}` }}
        >
          {activeClass ? activeClass.name : ""}
        </span>
        <BsChevronDown></BsChevronDown>
      </div>
      {openMenu && (
        <ul className="pt-1">
          {classes.map((classProps, index) => (
            <ClassObj
              key={index}
              classProps={classProps}
              setOpenMenu={setOpenMenu}
            >
              {" "}
            </ClassObj>
          ))}
        </ul>
      )}
    </div>
  );
};
