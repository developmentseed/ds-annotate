import React from "react";
import { useContext } from "react";
import { MainContext } from "../contexts/MainContext";
import { BsSquareFill } from "react-icons/bs";

export const ClassObj = ({ classProps }) => {
  const { activeClass, dispatchSetActiveClass } = useContext(MainContext);

  const setActiveClass = (class_) => {
    dispatchSetActiveClass({
      type: "SET_ACTIVE_CLASS",
      payload: class_,
    });
  };

  return (
    <li
      className={`subMenuHeader hoverAnimation`}
      style={{
        background: `${
          activeClass && activeClass.name === classProps.name
            ? activeClass.color
            : ""
        }`,
      }}
      onClick={() => {
        setActiveClass(classProps);
      }}
    >
      <span className="text-xs block float-left">
        <BsSquareFill style={{ color: classProps.color }}></BsSquareFill>
      </span>
      <span className="flex-1 duration-200 text-slate-900">
        {classProps.name}
      </span>
    </li>
  );
};
