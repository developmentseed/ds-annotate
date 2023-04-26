import React from "react";

import { Header } from "./Header";
import { MenuProjects } from "./MenuProjects";
import { MenuClass } from "./MenuClass";
import { MenuItems } from "./MenuItems";
import { DownloadData } from "./DownloadData";
import { MenuActions } from "./MenuActions";
import { ModuleSelector } from "./ModuleSelector";

export const Sidebar = () => {
  return (
    <aside>
      <div className="overflow-y-auto pt-2 pb-2 pl-3">
        <Header></Header>
      </div>
      <div className="overflow-y-auto pr-2 pl-2">
        <MenuProjects></MenuProjects>
        <div className="border-t border-gray-200 my-3"></div>
        <MenuClass></MenuClass>
        <div className="border-t border-gray-200 my-3"></div>
        <ModuleSelector></ModuleSelector>
        <div className="border-t border-gray-200 my-3"></div>
        <MenuItems></MenuItems>
        <div className="border-t border-gray-200 my-3"></div>
        <MenuActions></MenuActions>
        <div className="border-t border-gray-200 my-3"></div>
        <DownloadData></DownloadData>
      </div>
    </aside>
  );
};
