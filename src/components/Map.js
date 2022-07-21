import React from 'react';
import { useContext, useState, useEffect } from 'react';
import { MainContext } from './../contexts/MainContext';
import { BsViewList, BsSquareFill, BsChevronDown } from 'react-icons/bs';
import { ClassObj } from './ClassObj';

export const Map = () => {
  const { activeProject, activeClass } = useContext(MainContext);

  return (
    <div>
    {/* <p>{ JSON.stringify(activeProject) }</p> */}
     
    <p>{ JSON.stringify(activeClass)  }</p>
     
    </div>
  );
};
