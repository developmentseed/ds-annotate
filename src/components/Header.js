import React from "react";

import DevSeedLogo from "./../media/layout/ds-logo-pos.svg";

export const Header = ({ openSidebar, setOpenSidebar }) => {
  return (
    <div className="flex items-center mb-5">
      <img
        src={DevSeedLogo}
        alt="Development Seed logo"
        className="text-4xl cursor-pointer block float-left mr-2 h-9"
      />
      <span className="self-center text-xl font-semibold whitespace-nowrap">
        DS-Annotate
      </span>
    </div>
  );
};
