import React, { useContext, useState, useEffect } from "react";
import { MainContext } from "../contexts/MainContext";
import { ClassObj } from "./ClassObj";

import { getClassLayers } from "../utils/convert";
import { MenuTemplate } from "./MenuTemplate";

export const Badge = ({ activeClass }) => {
  return (
    <span
      className="inline-flex justify-center items-center px-2 ml-3 text-xs font-medium text-slate-800 bg-gray-200 rounded-full pr-4 pl-4"
      style={{ background: `${activeClass ? activeClass.color : ""}` }}
    >
      {activeClass ? activeClass.name : ""}
    </span>
  );
};

export const MenuClass = () => {
  const { activeProject, activeClass } = useContext(MainContext);
  const [classes, setClasses] = useState([]);
  useEffect(() => {
    const classLayers = getClassLayers(activeProject);
    setClasses(classLayers);
  }, [activeProject]);
  return (
    <MenuTemplate title={"Clasees"} badge={<Badge activeClass={activeClass} />}>
      <ul className="pt-1">
        {classes.map((classProps, index) => (
          <ClassObj key={index} classProps={classProps} />
        ))}
      </ul>
    </MenuTemplate>
  );
};
