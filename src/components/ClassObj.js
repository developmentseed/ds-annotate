import React from 'react';
import { useContext, useState, useEffect } from 'react';
import { MainContext } from '../contexts/MainContext';
import { BsViewList, BsSquareFill, BsChevronDown } from 'react-icons/bs';

export const ClassObj = ({ classProps }) => {
  const { activeClass, dispatchSetActiveClass } = useContext(MainContext);
  
  const SetActiveClass = (class_) => {
    dispatchSetActiveClass({
      type: 'SET_ACTIVE_CLASS',
      payload: class_,
    });
  };

  return (
    <li
      className={`subMenuHeader hoverAnimation`}
      style={{background:`${ activeClass && activeClass.name === classProps.name ? activeClass.color: ""}`}}
      onClick={() => {
        SetActiveClass(classProps);
      }}
    >
      <span className="text-1xl block float-left">
        <BsSquareFill style={{ color: classProps.color }}></BsSquareFill>
      </span>
      <span className={`font-medium flex-1 duration-200`}>
        {classProps.name}
      </span>
    </li>
  );
};
