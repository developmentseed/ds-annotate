import React from "react";

import { Header } from "./Header";
import { MenuProjects } from "./MenuProjects";
import { MenuClass } from "./MenuClass";
import { MenuItems } from "./MenuItems";
import { DownloadData } from "./DownloadData";
import { MenuActions } from "./MenuActions";

export const Sidebar = () => {
  return (
    <aside>
      <div className="overflow-y-auto pt-2 pb-2 pl-3">
        <Header />
      </div>
      <div className="overflow-y-auto pr-2 pl-2">
        <MenuProjects />
        <div className="border-t border-gray-200 my-1"></div>
        <MenuClass />
        <div className="border-t border-gray-200 my-1"></div>
        <MenuItems />
        <div className="border-t border-gray-200 my-1"></div>
        <MenuActions />
        <div className="border-t border-gray-200 my-1"></div>
        <DownloadData />
      </div>
    </aside>
  );
};
