import React from 'react';
import { useContext, useState, useEffect } from 'react';
import { MainContext } from './../contexts/MainContext';
import { BsViewList, BsSquareFill, BsChevronDown } from 'react-icons/bs';
import { ClassObj } from './ClassObj';

export const ClassesMenu = () => {
  const { activeProject } = useContext(MainContext);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const classLayers = Object.entries(
      activeProject && activeProject.properties
        ? activeProject.properties.classes
        : {}
    ).map((e) => ({
      name: e[0],
      color: e[1],
    }));
    setClasses(classLayers);
  }, [activeProject]);

  return (
    <div>
      <div className="menuHeader">
        <BsViewList></BsViewList>
        <span className=" text-base font-medium flex-1 duration-200 false">
          {'Classes'}
        </span>
        <BsChevronDown></BsChevronDown>
      </div>
      <ul className="pt-2">
        {classes.map((classProps, index) => (
          <ClassObj key={index} classProps={classProps}></ClassObj>
        ))}
      </ul>
    </div>
  );
};
