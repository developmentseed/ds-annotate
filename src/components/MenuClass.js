import React from 'react';
import { useContext, useState, useEffect } from 'react';
import { MainContext } from '../contexts/MainContext';
import { BsViewList, BsSquareFill, BsChevronDown } from 'react-icons/bs';
import { ClassObj } from './ClassObj';

import { getClassLayers } from '../utils/featureCollection';

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
        <span className=" text-base font-medium flex-1 duration-200 ">
          {'Class'}
        </span>
        <span
          className="inline-flex justify-center items-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full pr-4 pl-4"
          style={{ background: `${activeClass ? activeClass.color : ''}` }}
        >
          {activeClass ? activeClass.name : ''}
        </span>
        <BsChevronDown></BsChevronDown>
      </div>
      {openMenu && (
        <ul className="pt-2">
          {classes.map((classProps, index) => (
            <ClassObj
              key={index}
              classProps={classProps}
              setOpenMenu={setOpenMenu}
            >
              {' '}
            </ClassObj>
          ))}
        </ul>
      )}
    </div>
  );
};
