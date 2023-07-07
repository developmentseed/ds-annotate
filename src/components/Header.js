import React, { useState, useContext } from "react";
import { BsInfoCircleFill } from "react-icons/bs";

import { MainContext } from "./../contexts/MainContext";
import DevSeedLogo from "./../media/layout/ds-logo-pos.svg";

export const Header = () => {
  const { setDisplayModal } = useContext(MainContext);
  return (
    <div className="flex items-center mb-2">
      <a href="https://devseed.com/" target="_blank" rel="noopener noreferrer">
        <img
          src={DevSeedLogo}
          alt="Development Seed logo"
          className="text-4xl cursor-pointer block float-left mr-2 h-9"
        />
      </a>
      <span className="self-center text-xl text-slate-900 font-semibold whitespace-nowrap">
        DS-Annotate
      </span>
      <div className="self-center text-lg pt-1 text-slate-400 ml-3 cursor-pointer">
        <BsInfoCircleFill
          onClick={() => {
            setDisplayModal("block");
          }}
        />
      </div>
    </div>
  );
};
