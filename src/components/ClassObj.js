import React from "react";
import { useContext } from "react";
import { MainContext } from "../contexts/MainContext";
import { BsSquareFill } from "react-icons/bs";

export const ClassObj = ({ classProps, setOpenMenu }) => {
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
        setOpenMenu(false);
      }}
    >
      <span className="text-xs block float-left">
        <BsSquareFill style={{ color: classProps.color }}></BsSquareFill>
      </span>
      <span className={`flex-1 duration-200`}>{classProps.name}</span>
    </li>
  );
};
