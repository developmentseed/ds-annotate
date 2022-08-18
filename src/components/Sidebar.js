import React from 'react';

import { Header } from './Header';
import { MenuProjects } from './MenuProjects';
import { MenuClass } from './MenuClass';
import { MenuItems } from './MenuItems';
import { DownloadData } from './DownloadData';

export const Sidebar = () => {
  return (
    <aside>
      <div className="overflow-y-auto pt-2 pb-2 pl-3">
        <Header></Header>
      </div>
      <div className="overflow-y-auto pr-2 pl-2">
        <MenuProjects></MenuProjects>
        <MenuClass></MenuClass>
        <MenuItems></MenuItems>
        <DownloadData></DownloadData>
      </div>
    </aside>
  );
};
